cc.Class({
    extends: cc.Component,

    properties: {
        friend: cc.Prefab,
        avatarImgSprite: cc.Sprite,
        nickLabel: cc.Label,//
        desLabel: cc.EditBox,
        numLabel: cc.Label,
        sexSprite: cc.Sprite,
        mineIDLabel: cc.Label,
        friendIDLabel: cc.EditBox,
    },

    onLoad() {
        this.com = require('common');
        this.httpUtils = require("httpUtils");
        this.popup = require('popup');

        this.node_anim = this.node.runAction(cc.sequence(
            cc.scaleTo(0.05, 1.1),
            cc.scaleTo(0.2, 1.0)
        ));
        var ditu = this.node.getChildByName("ditu");
        ditu.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_chazhao_ditu"]);

        var fanhui = this.node.getChildByName("fanhui");
        fanhui.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_chazhao_X"]);

        var btnFind = this.node.getChildByName("btnFind");
        btnFind.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_chazhao_anniu"]);

        // var edtID = this.node.getChildByName("edtID");
        // edtID.getComponent(cc.EditBox).backgroundImage = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_chazhao_kuang"]);

        var mask = this.node.getChildByName("mask");
        mask.getComponent(cc.Mask).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_chazhao_touxiang"]);
    },

    start() {

    },

    init: function (userInfo) {
        console.log(userInfo)
        var nickName = "";
        if (userInfo.nickName && userInfo.nickName != "null")
            nickName = userInfo.nickName
        // this.nickLabel.string = "<b>" + nickName + "</b>";
        this.nickLabel.string = nickName;

        if (userInfo.des && userInfo.des != "null")
            this.desLabel.string = userInfo.des;

        var fans = 0;
        if (userInfo.fans && userInfo.fans != "null")
            fans = userInfo.fans;
        // this.numLabel.string = "<b>" + fans + "</b>";
        this.numLabel.string = fans;

        // this.mineIDLabel.string = "<b>" + userInfo.id + "</b>";
        this.mineIDLabel.string = userInfo.id;

        if (userInfo.sex) {
            this.sexSprite.spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_nv"]);
        } else {
            this.sexSprite.spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_nan"]);
        }

        this.createImage(userInfo.avatarUrl);
    },

    createImage: function (avatarUrl) {
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
            } catch (e) {
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

    btnFind: function (event, coustEvent) {
        var usrId = cc.sys.localStorage.getItem("usrId");
        if (this.friendIDLabel.string == "") {
            this.popup.tip(this.node, "输入的游戏ID不能为空");
            return;
        }
        if (usrId == this.friendIDLabel.string) {
            this.popup.tip(this.node, "不能输入自己的游戏ID");
            return;
        }

        var this_ = this;
        var params = {
            gameType: this.com.project_name,
            usrId: usrId,
            friendId: this.friendIDLabel.string
        };
        var token = cc.sys.localStorage.getItem("Token");
        var url = this.com.serverUrl + "/user/findUser";
        this.httpUtils._instance.httpPost(url, JSON.stringify(params), function (data) {
            console.log(data);

            var jsonD = JSON.parse(data);

            if (jsonD["errcode"] === 0) {
                var find = cc.instantiate(this_.friend);
                find.parent = this_.node;
                find.getComponent("LyFriendInfo").init(jsonD.data.data, jsonD.data.isFollow);
            } else {
                console.log(jsonD.msg)
                this_.popup.tip(this_.node, jsonD.msg);
            }
        }, token);
    },

    btnClose: function (event, coustEvent) {
        var this_ = this;

        if (this.node_anim) this.node.stopAction(this.node_anim);

        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId,
            des: this.desLabel.string
        };
        var token = cc.sys.localStorage.getItem("Token");
        var url = this.com.serverUrl + "/user/upUserDes";
        this.httpUtils._instance.httpPost(url, JSON.stringify(params), function (data) {
            console.log(data);

            var jsonD = JSON.parse(data);

            if (jsonD["errcode"] === 0) {
                console.log("个性签名上传成功")
            } else {
                console.log(jsonD.msg)
            }
        }, token);

        if (CC_WECHATGAME) {
            wx.hideKeyboard();
        }

        this.node.removeFromParent(true);
    },
});
