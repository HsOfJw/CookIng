var com = require('common');

cc.Class({
    extends: cc.Component,

    properties: {
        dlgAward: cc.Prefab,
        spinBtn: cc.Button,

        m_bgm: {
            default: null,
            url: cc.AudioClip
        }
    },

    onLoad () {
        this.com = require('common');
        this.httpUtils = require("httpUtils");

        this.node_anim = this.node.runAction(cc.sequence(
            cc.scaleTo(0.05, 1.1),
            cc.scaleTo(0.2, 1.0)
        ));

        this.com.loadTexture(this.node, ["X"], "png_paihangbang_fanhui");
        this.com.loadTexture(this.node, ["bg"], "png_zhuanjinbi_ditu");
        this.com.loadTexture(this.node, ["haoyouzhuli"], "png_zhuanjinbi_haoyouzhuli");
        this.com.loadTexture(this.node, ["kanshipin"], "png_haoyouzhuli_kanshipin");
        this.com.loadTexture(this.node, ["gengduojincai"], "png_zhuanjinbi_gengduojincai");

        this.showBanner();

        this._isViewVedio = false;
    },

    btnShare: function(event, coustEvent){
        this.getDailyShare();
    },

    getDailyShare: function(){
        var self = this;

        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId,
        };
        var token = cc.sys.localStorage.getItem("Token");
        this.httpUtils._instance.httpPost(this.com.serverUrl + '/user/getDailyShare1', JSON.stringify(params), function(data){
            var jsonD = JSON.parse(data);
            console.log("getDailyShare1")
            console.log(jsonD)
            if (jsonD["errcode"] == 0 && Number(jsonD.data) >= 3){
                self.dailyShare(false);
            } else {
                self.dailyShare(true);
            }
        }, token);
    },

    dailyShare: function(giveAward){
        if (!CC_WECHATGAME) return;

        if (giveAward) this.upDailyShare();

        var usrId = cc.sys.localStorage.getItem("usrId");
        cc.loader.loadRes("texture/share",function(err,data){
            wx.updateShareMenu({
                withShareTicket: true
            });
            wx.shareAppMessage({
                title: "抖音上超火的网红游戏",
                imageUrl: data.url,
                query: "key="+ usrId,
                success(res){
                    console.log("转发成功!!!", res);
                    if(res.shareTickets){
                        //分享到群
                    }
                    //wx.aldSendEvent('邀请好友-分享成功',{});
                },
                fail(res){
                    console.log("转发失败!!!" + JSON.stringify(res));
                    //wx.aldSendEvent('邀请好友-分享失败',{});
                } 
            })
        });
    },

    upDailyShare: function() {
        var self = this;

        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId,
        };
        var token = cc.sys.localStorage.getItem("Token");
        this.httpUtils._instance.httpPost(this.com.serverUrl + '/user/upDailyShare1', JSON.stringify(params), function(data){
            var jsonD = JSON.parse(data);
            console.log("upDailyShare1")
            console.log(jsonD)
            if (jsonD["errcode"] == 0){
                var lyAward = cc.instantiate(self.dlgAward);
                lyAward.parent = self.node;
                lyAward.getComponent("dlgAward").init(1, 600);

                self.com.saveData.gold += 600;
                self.com.setComData("gold", self.com.saveData.gold);
                self.node.dispatchEvent(new cc.Event.EventCustom("upGold", true));
            } else {
                console.log(jsonD.msg);
            }
        }, token);
    },

    btnVedio: function(event, coustEvent){
        var self = this;

        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId,
        };
        var token = cc.sys.localStorage.getItem("Token");
        this.httpUtils._instance.httpPost(this.com.serverUrl + '/user/getDailyVedio', JSON.stringify(params), function(data){
            var jsonD = JSON.parse(data);
            console.log("getDailyVedio")
            console.log(jsonD)
            if (jsonD["errcode"] == 0 && Number(jsonD.data) >= 5){
                self.getDailyShare();
            } else {
                self.dailyVedio();
            }
        }, token);
    },

    dailyVedio: function(){
        if (CC_WECHATGAME && !this._isViewVedio) {
            this.com.dlgGetGoldScript = this;
            this.spinBtn.interactable = false;

            if(!this._videoAd){
                this._videoAd = wx.createRewardedVideoAd({ adUnitId: 'adunit-8daba22adfefa58f' });
            }
            this._videoAd.onClose(this.vedioPlayOver1);
            var music = cc.sys.localStorage.getItem("CloseMusic");
            if(music == 1){
                cc.audioEngine.stopAll();; //停止背景音乐
            }
            this._videoAd.load().then(() => this._videoAd.show()).catch(err => console.log(err.errMsg));
        } else {
            this.afterVedioBegin();
        }
    },

    afterVedioBegin: function(){
        this._isViewVedio = false;

        var self = this;

        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId,
        };
        var token = cc.sys.localStorage.getItem("Token");
        this.httpUtils._instance.httpPost(this.com.serverUrl + '/user/upDailyVedio', JSON.stringify(params), function(data){
            var jsonD = JSON.parse(data);
            console.log("upDailyVedio")
            console.log(jsonD)
            if (jsonD["errcode"] == 0){
                var lyAward = cc.instantiate(self.dlgAward);
                lyAward.parent = self.node;
                lyAward.getComponent("dlgAward").init(1, 500);

                self.com.saveData.gold += 500;
                self.com.setComData("gold", self.com.saveData.gold);
                self.node.dispatchEvent(new cc.Event.EventCustom("upGold", true));
            } else {
                console.log(jsonD.msg);
            }
        }, token);
    },

    vedioPlayOver1: function(res){
        let this_ = com.dlgGetGoldScript;
        // 用户点击了【关闭广告】按钮
        // 小于 2.1.0 的基础库版本，res 是一个 undefined
        if (res && res.isEnded || res === undefined) {
            // 正常播放结束，可以下发游戏奖励
            // wx.aldSendEvent('游戏视频成功',{});

            if (CC_WECHATGAME) wx.aldSendEvent('每日转盘-看激励广告', {});
            this_._isViewVedio = true;

            this_.afterVedioBegin();
        }
        else {
            // 播放中途退出，不下发游戏奖励
            console.log('游戏视频失败');
            // wx.aldSendEvent('游戏视频失败',{});
        }
        var music = cc.sys.localStorage.getItem("CloseMusic");
        if(music == 1){
            cc.audioEngine.playMusic(this_.m_bgm, true);
        }

        this_._videoAd.offClose(this_.vedioPlayOver1);
        this_.spinBtn.interactable = true;
    },

    btnNavigate: function(event, coustEvent){
        var self = this;

        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId,
        };
        var token = cc.sys.localStorage.getItem("Token");
        this.httpUtils._instance.httpPost(this.com.serverUrl + '/user/getDailyNavigate', JSON.stringify(params), function(data){
            var jsonD = JSON.parse(data);
            console.log("getDailyNavigate")
            console.log(jsonD)
            if (jsonD["errcode"] == 0 && Number(jsonD.data) > 0){
                self.navigateGame(false);
            } else {
                self.navigateGame(true);
            }
        }, token);
    },

    navigateGame: function(giveAward){
        var id = Math.floor(cc.random0To1() * this.com.cfgOtherGame.length);
        var gameInfo = this.com.cfgOtherGame[id];

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
                            urls: [self.com.serverUrl_res + gameInfo.path],
                            success: function () {
                                console.log("wei xin previewImage success....");
                            }
                        })
                    } else {
                        //高于6.7.1，调用微信小游戏跳转
                        wx.navigateToMiniProgram({
                            appId: gameInfo.appid,             //目标小游戏的appId，必须与当前小游戏属于同一个公众号
                            path: "",                       //跳转后的场景，没研究过，我这里直接传空值跳主场景
                            extraData: {},
                            envVersion: 'release',          //跳转的目标小游戏版本，develop（开发版），trial（体验版），release（正式版）
                            success(res) {
                                console.log("跳转成功。。。",res)
                                if (giveAward) self.upNavigateGame();
                            }
                        })
                    }
                },
                fail(){
                    console.log(res);
                }
            })
        } else {
            if (giveAward) this.upNavigateGame();
        }
    },

    upNavigateGame: function() {
        var self = this;

        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId,
        };
        var token = cc.sys.localStorage.getItem("Token");
        this.httpUtils._instance.httpPost(this.com.serverUrl + '/user/upDailyNavigate', JSON.stringify(params), function(data){
            var jsonD = JSON.parse(data);
            console.log("upDailyNavigate")
            console.log(jsonD)
            if (jsonD["errcode"] == 0){
                var lyAward = cc.instantiate(self.dlgAward);
                lyAward.parent = self.node;
                lyAward.getComponent("dlgAward").init(1, 500);

                self.com.saveData.gold += 500;
                self.com.setComData("gold", self.com.saveData.gold);
                self.node.dispatchEvent(new cc.Event.EventCustom("upGold", true));
            } else {
                console.log(jsonD.msg);
            }
        }, token);
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

    showBanner: function(){
        if (CC_WECHATGAME) {
            let winSize = wx.getSystemInfoSync();
            console.log(winSize);
            let bannerHeight = 80;
            let bannerWidth = 300;
            if (this._bannerAd == null){
                this._bannerAd = wx.createBannerAd({
                    adUnitId: 'adunit-2d78bbddea098b1e',  //填写广告id
                    style: {
                        left: (winSize.windowWidth-bannerWidth)/2,
                        top: winSize.windowHeight - bannerHeight,
                        width: bannerWidth,
                    }
                });
            }
            this._bannerAd.show();  //banner 默认隐藏(hide)  要打开
            //微信缩放后得到banner的真实高度，从新设置banner的top 属性
            this._bannerAd.onResize(res => {
                this._bannerAd.style.top =  winSize.windowHeight - this._bannerAd.style.realHeight;
            })
        }
    },

    btnClose: function(event, coustEvent) {
        if (this._bannerAd) this._bannerAd.hide();
        
        this.node.removeFromParent(true);
    },
    // update (dt) {},

    onDestory:function(){
        if(this._videoAd){
            this._videoAd.offClose(this.vedioPlayOver1);
        }
    },
});
