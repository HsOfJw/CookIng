cc.Class({
    extends: cc.Component,

    properties: {
        lbGold: cc.RichText,
        lbDiamond: cc.RichText,
        lbPraise: cc.RichText,
        m_GetRewardAudio: {
            default: null,
            type: cc.AudioClip
        },
    },

    onLoad () {
        this.com = require('common');
        this.httpUtils = require("httpUtils");
        this.node_anim = this.node.runAction(cc.sequence(
            cc.scaleTo(0.05, 1.1),
            cc.scaleTo(0.2, 1.0)
        ));
        var ditu = this.node.getChildByName("ditu");
        ditu.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_gongxihuode_ditu"]);

        var X = this.node.getChildByName("X");
        X.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_chazhao_X"]);
        
        var zuanshi = this.node.getChildByName("zuanshi");
        zuanshi.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_jiangbei_binqilin"]);
        
        var jinbi = this.node.getChildByName("jinbi");
        jinbi.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_jiangbei_jinbi"]);

        var xin = this.node.getChildByName("xin");
        xin.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_xin"]);

        
        cc.audioEngine.playEffect(this.m_GetRewardAudio, false);
    },

    init: function(data){
        this._continue = false;

        this.lbGold.string = "X100";
        this.lbDiamond.string = "X1";
        this.lbPraise.string = "X" + this.com.saveData.praise;

        var this_ = this;

        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId,
            otherId: this.com.friendId,
            gold: this.com.saveData.gold,
            diamond: this.com.saveData.diamond,
            praise: this.com.saveData.praise
        };
        var token = cc.sys.localStorage.getItem("Token");
        var url = this.com.serverUrl + "/user/upHelpData";
        this.httpUtils._instance.httpPost(url, JSON.stringify(params), function(data){
            var jsonD = JSON.parse(data);
            if (jsonD["errcode"] === 0){
                console.log("帮助玩家成功！")
                
                this_.setVisitTimes();
            } else {
                console.log(jsonD.msg)
            }
        }, token);
    },

    setVisitTimes: function(){
        var this_ = this;
        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId,
            otherId: this.com.friendId,
        };
        var token = cc.sys.localStorage.getItem("Token");
        var url = this.com.serverUrl + "/user/setVisitTimes";
        this.httpUtils._instance.httpPost(url, JSON.stringify(params), function(data){
            var jsonD = JSON.parse(data);
            if (jsonD["errcode"] === 0){
                console.log("帮助增加成功");
            } else {
                console.log(jsonD.msg);
            }
            this_.setVisit();
        }, token);
    },

    setVisit: function(){
        var this_ = this;
        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId,
        };
        var token = cc.sys.localStorage.getItem("Token");
        var url = this.com.serverUrl + "/user/setVisit";
        this.httpUtils._instance.httpPost(url, JSON.stringify(params), function(data){
            var jsonD = JSON.parse(data);
            if (jsonD["errcode"] === 0){
                console.log("帮助次数增加成功");
                this_.helpTimes++;
            } else {
                console.log(jsonD.msg);
            }
            this_._continue = true;
        }, token);
    },

    btnClose: function(event, coustEvent) {
        if (!this._continue) return;

        //this.node.removeFromParent(true);
        //cc.director.loadScene('GameUI');
        if(this.node_anim) this.node.stopAction(this.node_anim);
        this.com.initUserDataFromServer(this.com.friendId);
    },
});
