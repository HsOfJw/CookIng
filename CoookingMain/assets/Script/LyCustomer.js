cc.Class({
    extends: cc.Component,

    properties: {
        m_dishes: cc.Prefab,
        m_bg: cc.Sprite,
        m_progress: cc.ProgressBar,
        m_scroll: cc.ScrollView,
        m_scrollContent: cc.Node,
        m_spSkeleton: sp.Skeleton,
        m_requirement: [],              //需求
        m_money: 0,                     //得到菜后给的金币
        m_run: false,
        m_waitTimePer: 0,
        m_redTimePer: 0,
    },

    onLoad () {
        this.com = require('common');
        this.httpUtils = require("httpUtils");

        var id = Math.floor(cc.random0To1() * this.com.humanIds.length);
        this._humanId = this.com.humanIds[id];
        this.com.humanIds.splice(id, 1);

        this.com.loadTexture(this.node, ["character","mumao_quanshen"], "png_" + this._humanId);

        var name = this.node.getChildByName("character").getChildByName("mumao_quanshen").getChildByName("richtext").getComponent(cc.RichText);
        name.string = "<b>" + this.com.getHumanInfo(this._humanId).name + "</b>";

        var spine = this.node.getChildByName("character").getChildByName("spine").getComponent(sp.Skeleton);
        cc.loader.loadRes(this._humanId + "_an", sp.SkeletonData, function (err, skeletonData) {
            spine.skeletonData = skeletonData;
            spine.setAnimation(0, "daiji", true);
        });

        this.com.loadTexture(this.node, ["bg"], "png_jingdutiao_di");
        this.com.loadTexture(this.node, ["progressBar"], "png_jindu_di");
        this.com.loadTexture(this.node, ["progressBar","bar"], "png_jindu_lv");
        this.com.loadTexture(this.node, ["character","mumao_quanshen","name_di"], "png_name_di");
    },

    start () {

    },

    init: function(id){
        this._totalWaitTime = this.com.getParam(1001).param * 60;

        var evt_5 = this.com.getMonthEvtByType(5);
        for(var i in evt_5) { 
            if (cc.random0To1()*100 <= evt_5[i].eventPer){
                this._totalWaitTime += evt_5[i].eventNum*60;
            }
        }

        this._selfId = id;

        this.node.x = -10000;
        this.node.y = 0;

        this.m_bg.node.active = false;
        this.m_progress.node.active = false;
        this.m_scroll.node.active = false;

        this.behaviour("normal");
    },

    behaviour: function(name){
        var bar = this.node.getChildByName("progressBar").getChildByName("bar");
        if (this._behaviour != name){
            switch (name){
                case "happy":
                    this.m_spSkeleton.getComponent(sp.Skeleton).animation = "gaoxin";
                break;
                case "impatience":
                    this.m_spSkeleton.getComponent(sp.Skeleton).animation = "shengqi";
                    bar.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_jindu_cheng"]);
                break;
                case "normal":
                    this.m_spSkeleton.getComponent(sp.Skeleton).animation = "daiji";
                    bar.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_jindu_lv"]);
                break;
                case "angry":
                    this.m_spSkeleton.getComponent(sp.Skeleton).animation = "dashengqi";
                    bar.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_jindu_hong"]);
                break;
                case "pleasant":
                    this.m_spSkeleton.getComponent(sp.Skeleton).animation = "dagaoxin";
                break;
            }
        }
        this._behaviour = name;
    },

    begin: function(){
        this.node.x = 0;
        
        this.m_bg.node.active = true;
        this.m_progress.node.active = true;
        this.m_scroll.node.active = true;
        this.m_progress.getComponent(cc.ProgressBar).progress = 1;
        this.m_run = true;
        this._waitTime = 0;

        var mumao_quanshen = this.node.getChildByName("character").getChildByName("mumao_quanshen");
        mumao_quanshen.active = false;

        this.createFood();
    },

    createFood: function(){
        if ((this.com.saveData.curStore == null || this.com.saveData.curStore == 1) && 
                this.com.saveData.month == 1 && (this.com.saveData.newbie == null || this.com.saveData.newbie <= 4105)){
            var dishesId = 11201;
            this.m_requirement[this.m_requirement.length] = dishesId;

            //console.log("createFood dishesId = " + dishesId);
            var dishes = cc.instantiate(this.m_dishes);
            dishes.getComponent('LyDishes').init(false, dishesId, this.com.getFoodProportion(dishesId));
            this.m_scrollContent.addChild(dishes);
            return;
        }
        if ((this.com.saveData.curStore == null || this.com.saveData.curStore == 1) && 
                this.com.saveData.month == 3 && (this.com.saveData.newbie == null || this.com.saveData.newbie < 4603)){
            var dishesId = 11202;
            this.m_requirement[this.m_requirement.length] = dishesId;

            //console.log("createFood dishesId = " + dishesId);
            var dishes = cc.instantiate(this.m_dishes);
            dishes.getComponent('LyDishes').init(false, dishesId, this.com.getFoodProportion(dishesId));
            this.m_scrollContent.addChild(dishes);
            return;
        }

        var foodNumRate = null;
        for (var i=0; i<this.com.cfgFoodNumRate.length; i++){
            if (this.com.cfgFoodNumRate[i].month == this.com.saveData.month){
                foodNumRate = this.com.cfgFoodNumRate[i];
                break;
            }
        }

        if (foodNumRate != null) {
            var fs = [foodNumRate.f1, foodNumRate.f2, foodNumRate.f3];
            var index = this.com.getPercentage(fs);

            var needFoods = this.com.copyJsonObj(this.com.saveData.foods);
            needFoods.sort();
            if (this.com.saveData.curStore == null || this.com.saveData.curStore == 1){
                for (var i=0; i<needFoods.length; i++){
                    if (needFoods[i] > 11302){
                        needFoods.splice(i, needFoods.length - i);
                        break;
                    }
                }
            } else if (this.com.saveData.curStore == 2){
                for (var i=0; i<needFoods.length; i++){
                    if (needFoods[i] > 11302 && i > 0){
                        needFoods.splice(0, i);
                        break;
                    }
                }
            }

            var fs_w = [];
            for (var i=0; i<needFoods.length; i++){
                for (var j=0; j<this.com.cfgFood.length; j++){
                    if (needFoods[i] == this.com.cfgFood[j].id){
                        fs_w[fs_w.length] = this.com.cfgFood[j].power;
                        break;
                    }
                }
            }
            //console.log("createFood need = " + index);
            for (var i=0; i< index+1; i++){
                var food_id = this.com.getPercentage(fs_w);
                var dishesId = needFoods[food_id];
                this.m_requirement[this.m_requirement.length] = dishesId;

                //console.log("createFood dishesId = " + dishesId);
                var dishes = cc.instantiate(this.m_dishes);
                dishes.getComponent('LyDishes').init(false, dishesId, this.com.getFoodProportion(dishesId));
                this.m_scrollContent.addChild(dishes);
            }
        }
    },

    removeFood: function(){
        if (this.m_requirement.length == 0){
            this.leave();
        }
    },

    leave: function(){
        this.com.humanIds.push(this._humanId);

        var mumao_quanshen = this.node.getChildByName("character").getChildByName("mumao_quanshen");
        mumao_quanshen.active = true;

        var evt = new cc.Event.EventCustom("customerLeave", true);
        evt.setUserData({
            id: this._selfId,
            behaviour: this._behaviour
        });
        this.node.dispatchEvent(evt);
        this.m_run = false;
    },

    evtTrigger: function(){
        this.m_waitTimePer = this.com.getParam(1002).param;
        this.m_redTimePer = 1 - this.com.getParam(1004).param;

        var evt_3 = this.com.getMonthEvtByType(3);
        for(var i in evt_3) { 
            if (cc.random0To1()*100 <= evt_3[i].eventPer){
                this.m_waitTimePer -= evt_3[i].eventNum;
                this.m_redTimePer = 1 - ((1 - this.m_redTimePer) + evt_3[i].eventNum);
            }
        }
    },

    update (dt) {
        if (this.m_run){
            this._waitTime++;
            if (this._waitTime >= this._totalWaitTime){
                this._waitTime = this._totalWaitTime;
                this.behaviour("angry");
                this.leave();
            } else {
                this.evtTrigger();
                var progress = this._waitTime / this._totalWaitTime;
                this.m_progress.getComponent(cc.ProgressBar).progress = 1 - progress;
                if (progress >= this.m_waitTimePer && progress < this.m_redTimePer){
                    this.behaviour("impatience");
                } else if (progress >= this.m_redTimePer) {
                    this.behaviour("angry");
                } else {
                    this.behaviour("normal");
                }
            }
        }
    },
});
