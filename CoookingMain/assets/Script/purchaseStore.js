
cc.Class({
    extends: cc.Component,

    properties: {
        Rich_diamond: cc.Label,
        Rich_gold: cc.Label,
        dlg_bg: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.com = require('common');
        this.popup = require('popup');
        this.node_anim = this.node.runAction(cc.sequence(
            cc.scaleTo(0.05, 1.1),
            cc.scaleTo(0.2, 1.0)
        ));

        var Img_icon = this.dlg_bg.getChildByName("Img_icon");
        Img_icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_ditu_zhongcanting"]);
        var goumai_anniuda = this.dlg_bg.getChildByName("goumai_anniuda");
        goumai_anniuda.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_goumai_anniuda"]);

        this.spend = this.com.getPurchase();
        // this.Rich_diamond.string = "<color=#9C651F>X" + this.spend[0] +"</c>";
        // this.Rich_gold.string = "<color=#9C651F>X" + this.spend[1] +"</c>";
        this.Rich_diamond.string = "X" + this.spend[0] ;
        this.Rich_gold.string = "X" + this.spend[1];
    },

    btnClose () {
        if(this.node_anim) this.node.stopAction(this.node_anim);
        this.node.removeFromParent(true);
    },

    btnPurchase(){
        if(this.com.saveData.diamond < this.spend[0]){
            console.log("钻石不足");
            this.popup.tip(this.node, "钻石不足");
            return;
        }
        if(this.com.saveData.gold < this.spend[1]){
            console.log("金币不足");
            this.popup.tip(this.node, "金币不足");
            return;
        }
        this.com.saveData.diamond -= Number(this.spend[0]);
        this.com.saveData.gold -= Number(this.spend[1]);
        this.com.saveData.allStore = 2;
        this.signIn();
    },
    
    signIn(){
        var usrId = cc.sys.localStorage.getItem("usrId");

        if (this.com.saveData.curStore == null || this.com.saveData.curStore != 2){
            var foods = this.com.copyJsonObj(this.com.saveData.foods);
            foods.push(11401);
            foods.push(11601);
            this.com.setComData("foods", foods);

            var shopItem = this.com.copyJsonObj(this.com.saveData.shopItem);
            shopItem["140"] = 1401;
            shopItem["240"] = 2401;
            shopItem["160"] = 1601;
            shopItem["161"] = 1611;
            shopItem["260"] = 2601;
            shopItem["261"] = 2611;
            this.com.setComData("shopItem", shopItem);

            this.com.setComData("curStore", 2);

            var startMonth = [];
            if (this.com.saveData.startMonth != null){
                startMonth = this.com.copyJsonObj(this.com.saveData.startMonth);
            }
            startMonth.push(this.com.saveData.month);
            this.com.setComData("startMonth", startMonth);

            var this_ = this;
            var httpUtils = require("httpUtils");
            var params = {
                usrId: usrId,
                jsonData: JSON.stringify(this.com.saveData)
            };
            var token = cc.sys.localStorage.getItem("Token");
            var url = this.com.serverUrl + "/user/saveUserData";
            httpUtils._instance.httpPost(url, JSON.stringify(params), function(data){
                var jsonD = JSON.parse(data);
                if (jsonD["errcode"] === 0){
                    console.log("保存玩家数据成功！")
                } else {
                    console.log(jsonD.msg)
                }

                this_.com.initUserDataFromServer(usrId);
            }, token);
        } else {
            this.com.initUserDataFromServer(usrId);
        }
    }

    // update (dt) {},
});
