cc.Class({
    extends: cc.Component,

    properties: {
        avatarImgSprite: cc.Sprite,
        nickLabel: cc.RichText,
        desLabel: cc.RichText,
        numLabel: cc.RichText,
        sexSprite: cc.Sprite,
    },

    onLoad () {
        this.com = require('common');
        this.httpUtils = require("httpUtils");

        var bg = this.node.getChildByName("bg");
        bg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_hengtiao"]);
        
        var btnGo = this.node.getChildByName("btnGo");
        btnGo.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_fangwen"]);

        var mask = this.node.getChildByName("mask");
        mask.getComponent(cc.Mask).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_chazhao_touxiang"]);
    },

    start () {

    },

    init: function(itemInfo){
        console.log(itemInfo)
        var nickName = "";
        if (itemInfo.nickName && itemInfo.nickName != "null")
            nickName = itemInfo.nickName
        this.nickLabel.string = "<b>" + nickName + "</b>";

        var des = "";
        if (itemInfo.des && itemInfo.des != "null")
            des = itemInfo.des;
        this.desLabel.string = "<b>" + des + "</b>";

        var fans = 0;
        if (itemInfo.fans && itemInfo.fans != "null")
            fans = itemInfo.fans;
        this.numLabel.string = "<b>粉丝: " + fans + "</b>";

        if (itemInfo.sex){
            this.sexSprite.spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_nv"]);
        } else {
            this.sexSprite.spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_nan"]);
        }

        this.createImage(itemInfo.avatarUrl);

        this._id = itemInfo.id;
    },

    btnGo: function(event, customData){
        if (CC_WECHATGAME) wx.aldSendEvent('社交-访问', {});

        var parent = this.node;
        while (parent.parent != null){
            parent = parent.parent;
        }

        var ret = this.com.setAchive(3, parent.children[0]);
        var this_ = this;
        if (ret){
            this.node.runAction(cc.sequence(
                cc.delayTime(3.0),
                cc.callFunc(function(){
                    this_.com.saveUserData();
                    this_.com.isSave = false;
                    this_.com.initUserDataFromServer(this_._id);
                })
            ));
        } else {
            this_.com.saveUserData();
            this_.com.isSave = false;
            this_.com.initUserDataFromServer(this_._id);
        }
    },

    createImage(avatarUrl) {
        if (CC_WECHATGAME) {
            try {
                let image = wx.createImage();
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        console.log(e);
                        this.avatarImgSprite.node.active = false;
                    }
                };
                image.src = avatarUrl;
            }catch (e) {
                console.log(e);
                this.avatarImgSprite.node.active = false;
            }
        } else {
            cc.loader.load({
                url: avatarUrl, type: 'jpg'
            }, (err, texture) => {
                this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    },
});
