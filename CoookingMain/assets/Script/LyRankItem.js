cc.Class({
    extends: cc.Component,

    properties: {
        spRanking: cc.Sprite,
        lbRanking: cc.Label,
        avatarImgSprite: cc.Sprite,
        nickLabel: cc.Label,
        desLabel: cc.Label,
        numLabel: cc.Label,
        sexSprite: cc.Sprite,
        btnFollow: cc.Button,
    },

    onLoad () {
        this.com = require('common');
        this.httpUtils = require("httpUtils");

        var bg = this.node.getChildByName("bg");
        bg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_paihangbang_hengtiao"]);
        
        var btnFollow = this.node.getChildByName("btnFollow");
        btnFollow.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_paihangbang_guanyu"]);

        var mask = this.node.getChildByName("mask");
        mask.getComponent(cc.Mask).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_paihangbang_touxiang"]);

        this.spRanking.node.active = false;
        this.lbRanking.node.active = false;
    },

    init: function(ranking, itemInfo, type){
        var nickName = "";
        if (itemInfo.nickName && itemInfo.nickName != "null")
            nickName = itemInfo.nickName
        // this.nickLabel.string = "<b>" + nickName + "</b>";
        this.nickLabel.string = nickName ;

        var des = "";
        if (itemInfo.des && itemInfo.des != "null")
            des = itemInfo.des;
        this.desLabel.string = des;

        if (type == 0){
            var maxScore = 0;
            if (itemInfo.maxScore && itemInfo.maxScore != "null")
                maxScore = itemInfo.maxScore;
            this.numLabel.string = "好评: " + maxScore ;
        } else if (type == 1){
            var fans = 0;
            if (itemInfo.fans && itemInfo.fans != "null")
                fans = itemInfo.fans;
            this.numLabel.string = "金币: " + fans ;
        }

        if (itemInfo.sex){
            this.sexSprite.spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_nv"]);
        } else {
            this.sexSprite.spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_nan"]);
        }

        if (ranking == 0){
            this.spRanking.node.active = true;
            this.spRanking.spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_paihangbang_jinpai"]);
        } else if(ranking == 1){
            this.spRanking.node.active = true;
            this.spRanking.spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_paihangbang_yinpai"]);
        } else if(ranking == 2){
            this.spRanking.node.active = true;
            this.spRanking.spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_paihangbang_tongpai"]);
        } else {
            this.lbRanking.node.active = true;
            this.lbRanking.string =  (ranking + 1).toString() ;
        }

        var usrId = cc.sys.localStorage.getItem("usrId");
        if (usrId == itemInfo.id){
            //this.btnFollow.node.active = false;
            this.btnFollow.enabled = false;
            this.btnFollow.node.color = cc.color(180,180,180,255);
        }

        this._friendId = itemInfo.id;

        this.createImage(itemInfo.avatarUrl);
    },

    BtnFollowClick: function(event, customData){
        if (CC_WECHATGAME) wx.aldSendEvent('排行榜-关注', {});

        var this_ = this;

        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            gameType: this.com.project_name,
            usrId: usrId,
            friendId: this._friendId
        };
        var token = cc.sys.localStorage.getItem("Token");
        var url = this.com.serverUrl + "/user/findUser";
        this.httpUtils._instance.httpPost(url, JSON.stringify(params), function(data){
            console.log(data);

            var jsonD = JSON.parse(data);

            if (jsonD["errcode"] === 0){
                var evt = new cc.Event.EventCustom("showUserInfo", true);
                evt.setUserData({
                    data: jsonD.data.data, 
                    isFollow: jsonD.data.isFollow
                });
                this_.node.dispatchEvent(evt);
            } else {
                console.log(jsonD.msg)
            }
        }, token);
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
            try {
                cc.loader.load({
                    url: avatarUrl, type: 'jpg'
                }, (err, texture) => {
                    this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
                });
            }catch (e) {
                console.log(avatarUrl);
                //cc.loader.clear();
                this.avatarImgSprite.node.active = false;
            }
        }
    },
});
