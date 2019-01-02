cc.Class({
    extends: cc.Component,

    properties: {
        avatarImgSprite: cc.Sprite,
        nickLabel: cc.RichText,
        desLabel: cc.RichText,
        numLabel: cc.RichText,
    },

    onLoad () {
        this.com = require('common');
        this.httpUtils = require("httpUtils");

        var bg = this.node.getChildByName("ditu");
        bg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_huodong_gengduofuli_ditu"]);

        var jiangli = this.node.getChildByName("jiangli");
        jiangli.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_huodong_gengduofuli_jiangli"]);
    },

    init: function(itemInfo){
        var nickName = "";
        if (itemInfo.name && itemInfo.name != "null")
            nickName = itemInfo.name
        this.nickLabel.string = "<b>" + nickName + "</b>";

        var des = "";
        if (itemInfo.des && itemInfo.des != "null")
            des = itemInfo.des;
        this.desLabel.string = "<b>" + des + "</b>";

        this.createImage(this.com.serverUrl_res + itemInfo.path);

        this._info = itemInfo;

        this.getNavigateGame();
    },

    getNavigateGame: function() {
        var self = this;

        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            gameType: this.com.project_name,
            usrId: usrId,
            appId: this._info.appid
        };
        var token = cc.sys.localStorage.getItem("Token");
        this.httpUtils._instance.httpPost(this.com.serverUrl + '/user/getNavigateGame', JSON.stringify(params), function(data){
            var jsonD = JSON.parse(data);
            var lingqu = self.node.getChildByName("lingqu");
            if (jsonD["errcode"] == 0){
                lingqu.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(self.com.res_loaded["png_huodong_gengduofuli_quwan"]);
                self.node.getChildByName("jiangli").active = false;
                self.node.getChildByName("lbAward").active = false;
            } else {
                lingqu.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(self.com.res_loaded["png_huodong_gengduofui_lingqu"]);
                self.numLabel.string = "<b>" + self.com.getParam(1011).param + "</b>";
            }
        }, token);
    },

    upNavigateGame: function() {
        var self = this;

        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            gameType: this.com.project_name,
            usrId: usrId,
            appId: this._info.appid
        };
        var token = cc.sys.localStorage.getItem("Token");
        this.httpUtils._instance.httpPost(this.com.serverUrl + '/user/upNavigateGame', JSON.stringify(params), function(data){
            var jsonD = JSON.parse(data);
            var lingqu = self.node.getChildByName("lingqu");
            if (jsonD["errcode"] == 0){
                lingqu.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(self.com.res_loaded["png_huodong_gengduofuli_quwan"]);
                self.node.getChildByName("jiangli").active = false;
                self.node.getChildByName("lbAward").active = false;

                self.com.setComData("diamond", self.com.saveData.diamond + self.com.getParam("1011").param);

                self.node.dispatchEvent(new cc.Event.EventCustom("upDiamond", true));
            } else {
                lingqu.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(self.com.res_loaded["png_huodong_gengduofui_lingqu"]);
                self.numLabel.string = "<b>" + self.com.getParam(1011).param + "</b>";
            }
        }, token);
    },

    btnNavigate: function(event, customData){
        if (CC_WECHATGAME) wx.aldSendEvent('更多福利-' + this._info.name, {});

        var self = this;
        if (CC_WECHATGAME) {
            wx.getSystemInfo({
                success(res){
                    //比较版本，微信6.7.1版本以上才能实现小游戏相互跳转
                    var resule = self.compareVersion(res.version, "6.7.1");
                    //低于6.7.1版本，不能跳转，
                    if(resule < 0){
                        //后台获取的广告信息，自行去接
                        wx.previewImage({
                            urls: [self.com.serverUrl_res + self._info.path],
                            success: function () {
                                console.log("wei xin previewImage success....");
                            }
                        })
                    } else {
                        //高于6.7.1，调用微信小游戏跳转
                        wx.navigateToMiniProgram({
                            appId: self._info.appid,             //目标小游戏的appId，必须与当前小游戏属于同一个公众号
                            path: "",                       //跳转后的场景，没研究过，我这里直接传空值跳主场景
                            extraData: {},
                            envVersion: 'release',          //跳转的目标小游戏版本，develop（开发版），trial（体验版），release（正式版）
                            success(res) {
                                console.log("跳转成功。。。",res)
                                self.upNavigateGame();
                            }
                        })
                    }
                },
                fail(){
                    console.log(res);
                }
            })
        } else {
            this.upNavigateGame();
        }
    },

    compareVersion(v1, v2) {
        v1 = v1.split('.');
        v2 = v2.split('.');
        var len = Math.max(v1.length, v2.length);
        while (v1.length < len) {
            v1.push('0');
        }
        while (v2.length < len) {
            v2.push('0');
        }
        for (var i = 0; i < len; i++) {
            var num1 = parseInt(v1[i]);
            var num2 = parseInt(v2[i]);
            console.log(num1);
            console.log(num2);
            if (num1 > num2) {
                return 1;
            } else if (num1 < num2) {
                return -1;
            }
        }
        return 0;
    },

    createImage(avatarUrl) {
        var this_ = this;
        if (CC_WECHATGAME) {
            try {
                let image = wx.createImage();
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        this_.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        console.log(e);
                        this_.avatarImgSprite.node.active = false;
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
                this_.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    },

});
