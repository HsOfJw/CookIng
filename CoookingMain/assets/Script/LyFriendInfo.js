cc.Class({
    extends: cc.Component,

    properties: {
        avatarImgSprite: cc.Sprite,
        nickLabel: cc.Label,
        desLabel: cc.Label,
        numLabel: cc.Label,
        sexSprite: cc.Sprite,
    },

    onLoad () {
        this.com = require('common');
        this.httpUtils = require("httpUtils");
        this.popup = require('popup');

        var ditu = this.node.getChildByName("ditu");
        ditu.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_chazhao_ditu"]);
        
        var fanhui = this.node.getChildByName("fanhui");
        fanhui.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_chazhao_X"]);

        var mask = this.node.getChildByName("mask");
        mask.getComponent(cc.Mask).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_chazhao_touxiang"]);

        var btnGo = this.node.getChildByName("btnGo");
        btnGo.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_chazhao_fangwen"]);
    },

    start () {

    },

    init: function(userInfo, isFollow){
        console.log(userInfo)
        var nickName = "";
        if (userInfo.nickName && userInfo.nickName != "null")
            nickName = userInfo.nickName
        // this.nickLabel.string = "<b>" + nickName + "</b>";
        this.nickLabel.string =nickName;

        this.desLabel.string = "";
        if (userInfo.des && userInfo.des != "null")
            this.desLabel.string = userInfo.des;

        var fans = 0;
        if (userInfo.fans && userInfo.fans != "null")
            fans = userInfo.fans;
        // this.numLabel.string = "<b>" + fans + "</b>";
        this.numLabel.string =fans;

        if (userInfo.sex){
            this.sexSprite.spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_nv"]);
        } else {
            this.sexSprite.spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_nan"]);
        }

        this._id = userInfo.id;
        this._isFollow = isFollow;

        var usrId = cc.sys.localStorage.getItem("usrId");
        if (usrId != this._id){
            var btnFollow = this.node.getChildByName("btnFollow");
            if (isFollow){
                btnFollow.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_chazhao_yiguanzhu"]);
            } else {
                btnFollow.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_chazhao_guanzhu"]);
            }
        }

        this.createImage(userInfo.avatarUrl);
    },

    createImage: function(avatarUrl) {
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

    btnFollowClick: function(event, coustEvent) {
        var this_ = this;

        var btnFollow = this.node.getChildByName("btnFollow");

        if (this._isFollow){
            var usrId = cc.sys.localStorage.getItem("usrId");
            var params = {
                usrId: usrId,
                followId: this._id
            };
            var token = cc.sys.localStorage.getItem("Token");
            var url = this.com.serverUrl + "/user/cancelFollow";
            this.httpUtils._instance.httpPost(url, JSON.stringify(params), function(data){
                console.log(data);

                var jsonD = JSON.parse(data);

                if (jsonD["errcode"] === 0){
                    console.log("取消关注成功")
                    this_._isFollow = false;
                    btnFollow.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this_.com.res_loaded["png_shejiao_chazhao_guanzhu"]);
                    this_.popup.tip(this_.node, "取消关注成功");
                } else {
                    console.log(jsonD.msg)
                }
            }, token);
        } else {
            var usrId = cc.sys.localStorage.getItem("usrId");
            var params = {
                usrId: usrId,
                followId: this._id
            };
            var token = cc.sys.localStorage.getItem("Token");
            var url = this.com.serverUrl + "/user/follow";
            this.httpUtils._instance.httpPost(url, JSON.stringify(params), function(data){
                console.log(data);

                var jsonD = JSON.parse(data);

                if (jsonD["errcode"] === 0){
                    console.log("关注成功")
                    this_._isFollow = true;
                    btnFollow.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this_.com.res_loaded["png_shejiao_chazhao_yiguanzhu"]);
                    this_.popup.tip(this_.node, "关注成功");
                } else {
                    console.log(jsonD.msg)
                }
            }, token);
        }
    },

    btnGoClick: function(event, coustEvent) {
        var ret = this.com.setAchive(3, this.node);
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

    btnClose: function(event, coustEvent) {
        this.node.removeFromParent(true);
    },
});
