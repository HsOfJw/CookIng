cc.Class({
    extends: cc.Component,

    properties: {
        spQuality: cc.Sprite,
        lbName: cc.Label,//
        lbDes: cc.Label,
        spAward: cc.Sprite,
        lbAward: cc.Label,
    },

    onLoad () {
        this.com = require('common');
        this.httpUtils = require("httpUtils");

        this.com.loadTexture(this.node, ["bg"], "png_jiangbei_hengtiao");
    },

    init: function(itemInfo){
        if (itemInfo.quality == 1){
            this.com.loadTexture(this.spQuality.node, [], "png_jiagbei_tongpai");
        } else if (itemInfo.quality == 2){
            this.com.loadTexture(this.spQuality.node, [], "png_jiangbei_yinpai");
        } else if (itemInfo.quality == 3){
            this.com.loadTexture(this.spQuality.node, [], "png_jiangbei_jinpai");
        }

        //this.lbName.string = "<b>" + itemInfo.name + "</b>";
        // this.lbDes.string = "<b>" + itemInfo.des + "</b>";
        this.lbName.string =itemInfo.name;
        this.lbDes.string =itemInfo.des ;

        var hasGet = false;
        for (var key in this.com.saveData.achiveHistory){
            if (this.com.saveData.achiveHistory[key] == itemInfo.id){
                hasGet = true;
                break;
            }
        }

        if (!hasGet){
            var pos = itemInfo.price.indexOf(":");
            var awardIcon = Number(itemInfo.price.substring(0, pos));
            var awardNum = Number(itemInfo.price.substring(pos + 1, itemInfo.price.length));

            if (awardIcon == 1){
                this.com.loadTexture(this.spAward.node, [], "png_jiangbei_jinbi");
            } else if (awardIcon == 2){
                this.com.loadTexture(this.spAward.node, [], "png_jiangbei_zuanshi");
            } else if (awardIcon == 3){
                this.com.loadTexture(this.spAward.node, [], "png_jiangbei_binqilin");
            }

            // this.lbAward.string = "<b>" + awardNum + "</b>";
            this.lbAward.string = awardNum ;

            var btnGet = this.com.loadTexture(this.node, ["btnGet"], "png_jiangbei_lingqu");
            var curNum = this.com.saveData.achive[itemInfo.type];
            if (!curNum || curNum < itemInfo.num){
                btnGet.getComponent(cc.Button).enabled = false;
                //btnGet.color = cc.color(180,180,180,255);
                this.node.getChildByName("mask").active = true;
            }
        } else {
            this.node.getChildByName("btnGet").active = false;
            this.node.getChildByName("spGift").active = false;
            this.node.getChildByName("lbNum").active = false;
        }

        this._Info = itemInfo;
    },

    btnGetClick: function(event, customData){
        for (var key in this.com.saveData.achiveHistory){
            if (this.com.saveData.achiveHistory[key] == this._Info.id){
                console.log("已经领取过该成就[" + this._Info.id + "]");
                return;
            }
        }
        
        var curNum = this.com.saveData.achive[this._Info.type];
        if (curNum == null) curNum = 0;

        if (curNum >= this._Info.num){
            var pos = this._Info.price.indexOf(":");
            var awardType = Number(this._Info.price.substring(0, pos));
            var awardNum = Number(this._Info.price.substring(pos + 1, this._Info.price.length));

            if (awardType == 1){
                this.com.saveData.gold += awardNum;
                this.node.dispatchEvent(new cc.Event.EventCustom("upGold", true));
            } else if (awardType == 2){
                this.com.saveData.diamond += awardNum;
                this.node.dispatchEvent(new cc.Event.EventCustom("upDiamond", true));
            } else if (awardType == 3){
                this.com.saveData.gift += awardNum;
                this.node.dispatchEvent(new cc.Event.EventCustom("upGift", true));
            }

            this.com.saveData.achiveHistory.push(this._Info.id);
            console.log("领取成就奖励成功");

            if (CC_WECHATGAME) wx.aldSendEvent('领取成就奖励', {});

            var evt = new cc.Event.EventCustom("getAchivementAward", true);
            evt.setUserData({
                awardType: awardType,
                awardNum: awardNum
            });
            this.node.dispatchEvent(evt);

            this.node.getChildByName("btnGet").active = false;
            this.node.getChildByName("spGift").active = false;
            this.node.getChildByName("lbNum").active = false;
        } else {
            console.log("当前[" + curNum + "],还未达成该成就的完成条件[" + this._Info.num + "]");
        }
    },
});
