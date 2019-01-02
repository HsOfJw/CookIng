var com = require('common');

cc.Class({
    extends: cc.Component,

    properties: {
        spinBtn: {
            default: null,      // The default value will be used only when the component attachin                    // to a node for the first time
            type:cc.Button,     // optional, default is typeof default
            visible: true,      // optional, default is true
            displayName: 'SpinBtn', // optional
        },
        wheelSp:{
            default:null,
            type:cc.Sprite
        },
        maxSpeed:{
            default:5,
            type:cc.Float,
            max:15,
            min:2,
        },
        duration:{
            default:3,
            type:cc.Float,
            max:5,
            min:1,
            tooltip:"减速前旋转时间"
        },
        acc:{
            default:0.1,
            type:cc.Float,
            max:0.2,
            min:0.01,
            tooltip:"加速度"
        },
        targetID:{
            default:0,
            type:cc.Integer,
            max:7,
            min:0,
            tooltip:"指定结束时的齿轮"
        },
        springback:{
            default:false,
            tooltip:"旋转结束是否回弹"
        },
        effectAudio:{
            default:null,
            url:cc.AudioClip
        },
        activeScrollViewContent: cc.Node,
        activeItem: cc.Prefab,
        dlgAward: cc.Prefab,
        dlgAwardShare: cc.Prefab,

        m_bgm: {
            default: null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function () {
        this.com = require('common');
        this.httpUtils = require("httpUtils");
        this.popup = require('popup');

        this.node_anim = this.node.runAction(cc.sequence(
            cc.scaleTo(0.05, 1.1),
            cc.scaleTo(0.2, 1.0)
        ));
        this._times = 0;
        this._isViewVedio = false;

        this.wheelState = 0;    
        this.curSpeed = 0;
        this.spinTime = 0;                   //减速前旋转时间
        this.gearNum = 8;
        this.defaultAngle = 360/8/2;        //修正默认角度
        this.gearAngle = 360/this.gearNum;   //每个齿轮的角度
        this.wheelSp.node.rotation = this.defaultAngle;
        this.finalAngle = 0;                 //最终结果指定的角度
        this.effectFlag = 0;                 //用于音效播放

        this._select = true;
        this._curBtn = 0;
        this.statusBtn();
        
        // if(!cc.sys.isBrowser)
        // {
        //     cc.loader.loadRes('Sound/game_turntable', function(err,res){if(err){console.log('...err:'+err);}});
        // }

        var self = this;
        this.spinBtn.node.on(cc.Node.EventType.TOUCH_END, function(event){
            self.getDailyReward();
        }.bind(this));

        this.com.loadTexture(this.node, ["gengduofuli"], "png_gengduofuli");
        this.com.loadTexture(this.node, ["guanzhuyouli"], "png_guanzhuyouli");
        this.com.loadTexture(this.node, ["meirizhuanpan"], "png_meirizhuanpan");
        this.com.loadTexture(this.node, ["tiantianyouli"], "png_tiantianyouli");
        this.com.loadTexture(this.node, ["xinshoujiangli"], "png_xinshoujiangli");
        this.com.loadTexture(this.node, ["cha"], "png_cha");
        this.com.loadTexture(this.node, ["zhuanpan_ditu"], "png_zhuanpan_ditu");

        this.com.loadTexture(this.node, ["wheel","zhuanpan","bg"], "png_zhuanpan");
        this.com.loadTexture(this.node, ["wheel","zhizhen"], "png_zhizhen");
        this.com.loadTexture(this.node, ["wheel","anniu"], "png_anniu");
        this.com.loadTexture(this.node, ["wheel","kanguanggaoliangci"], "png_kanguanggaoliangci");
        this.com.loadTexture(this.node, ["wheel","gouxuan"], "png_gouxuan");
        this.com.loadTexture(this.node, ["wheel","renwu"], "png_renwu");

        this.com.loadTexture(this.node, ["follow","DT"], "png_huodong_guanzhuyouli_DT");

        // this.com.loadTexture(this.node, ["wheel","zhuanpan","node_0","icon"], "png_zhuanpan_jinbi");
        // this.com.loadTexture(this.node, ["wheel","zhuanpan","node_1","icon"], "png_zhuanpan_tiandian");
        // this.com.loadTexture(this.node, ["wheel","zhuanpan","node_2","icon"], "png_zuanpan_zuanshi");
        // this.com.loadTexture(this.node, ["wheel","zhuanpan","node_3","icon"], "png_zhuanpan_zailaiyici");
        // this.com.loadTexture(this.node, ["wheel","zhuanpan","node_4","icon"], "png_zhuanpan_tiandian");
        // this.com.loadTexture(this.node, ["wheel","zhuanpan","node_5","icon"], "png_zuanpan_zuanshi");
        // this.com.loadTexture(this.node, ["wheel","zhuanpan","node_6","icon"], "png_zhuanpan_jinbi");
        // this.com.loadTexture(this.node, ["wheel","zhuanpan","node_7","icon"], "png_zhuanpan_tiandian");

        this.com.loadTexture(this.node, ["dailyShare","bunaibaibuna"], "png_bunaibaibuna");
        this.com.loadTexture(this.node, ["dailyShare","node1","lijiifei_icon"], "png_lijiifei_icon");
        this.com.loadTexture(this.node, ["dailyShare","node1","loginShareIconBg"], "png_loginShareIconBg");
        this.com.loadTexture(this.node, ["dailyShare","node1","loginShareIconBg1"], "png_loginShareIconBg");
        this.com.loadTexture(this.node, ["dailyShare","node1","loginShareIconBg2"], "png_loginShareIconBg");
        this.com.loadTexture(this.node, ["dailyShare","node2","qingsongzuocai_icon"], "png_qingsongzuocai_icon");
        this.com.loadTexture(this.node, ["dailyShare","node2","loginShareIconBg"], "png_loginShareIconBg");
        this.com.loadTexture(this.node, ["dailyShare","node2","loginShareIconBg1"], "png_loginShareIconBg");
        this.com.loadTexture(this.node, ["dailyShare","node2","loginShareIconBg2"], "png_loginShareIconBg");
        this.com.loadTexture(this.node, ["dailyShare","node3","kaidianwuyou_icon"], "png_kaidianwuyou_icon");
        this.com.loadTexture(this.node, ["dailyShare","node3","loginShareIconBg"], "png_loginShareIconBg");
        this.com.loadTexture(this.node, ["dailyShare","node3","loginShareIconBg1"], "png_loginShareIconBg");
        this.com.loadTexture(this.node, ["dailyShare","node3","loginShareIconBg2"], "png_loginShareIconBg");
        this.com.loadTexture(this.node, ["dailyShare","lijiyaoqing"], "png_lijiyaoqing");

        this.com.loadTexture(this.node, ["loginShare","liwu_icon"], "png_liwu_icon");
        this.com.loadTexture(this.node, ["loginShare","lingqu_anniuda"], "png_lingqu_anniuda");
        this.com.loadTexture(this.node, ["loginShare","renwu"], "png_renwu");
        this.com.loadTexture(this.node, ["loginShare","kanguanggaoliangci"], "png_hehaoyouyiqiyouxi");
    },

    upDailyReward: function(cb) {
        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId,
            gameType: this.com.project_name
        };
        var token = cc.sys.localStorage.getItem("Token");
        this.httpUtils._instance.httpPost(this.com.serverUrl + '/user/upDailyReward', JSON.stringify(params), function(data){
            var jsonD = JSON.parse(data);
            if (jsonD["errcode"] === 0){
                
            } else {
                console.log(jsonD.msg);
            }
        }, token);
    },
    
    getDailyReward: function() {
        if (this._times >= 2){
            this.popup.tip(this.node, "今日次数已用完");
            return;
        }

        var self = this;

        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId,
            gameType: this.com.project_name
        };
        var token = cc.sys.localStorage.getItem("Token");
        this.httpUtils._instance.httpPost(this.com.serverUrl + '/user/getDailyReward', JSON.stringify(params), function(data){
            var jsonD = JSON.parse(data);
            console.log(jsonD)
            if (jsonD["errcode"] === 0){
                var times = 1;
                if (self._select){
                    times = 2;
                }
                if (jsonD.data.times < times){
                    self.beginRotate();
                } else {
                    //self._times = 2;
                    console.log("今日已转" + jsonD.data.times + "次");
                    self.popup.tip(self.node, "今日次数已用完");
                }
            } else {
                self.beginRotate();
            }
        }, token);
    },

    beginRotate: function(){
        if (CC_WECHATGAME && this._times == 0 && !this._isViewVedio && this._select) {
            this.com.wheelUIScript = this;
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
        console.log("begin spin");
        if(this.wheelState !== 0)
        {
            return;
        }
        this.decAngle = 360; //2*360;  // 减速旋转两圈
        this.wheelState = 1;
        this.curSpeed = 0;
        this.spinTime = 0;
        this.awardInfo = this.com.getWheelAward();
        console.log(this.awardInfo); 
        this.targetID = this.awardInfo.position - 1;
        // var act = cc.rotateTo(10, 360*10);
        // this.wheelSp.node.runAction(act.easing(cc.easeSineInOut()));
    },

    vedioPlayOver1: function(res){
        let this_ = com.wheelUIScript;
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
    
    caculateFinalAngle:function(targetID)
    {
        this.finalAngle = 360-this.targetID*this.gearAngle + this.defaultAngle;
        if(this.springback)
        {
            this.finalAngle += this.gearAngle;
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.wheelState === 0)
        {
            return;
        }
        // console.log('......update');
        // console.log('......state=%d',this.wheelState);
       
        // 播放音效有可能卡
        this.effectFlag += this.curSpeed;
        if(/*!cc.sys.isBrowser &&*/ this.effectFlag >= this.gearAngle)
        {
            if(this.audioID)
            {
                // cc.audioEngine.pauseEffect(this.audioID);
            }
            // this.audioID = cc.audioEngine.playEffect(this.effectAudio,false);
            // this.audioID = cc.audioEngine.playEffect(cc.url.raw('resources/Sound/game_turntable.mp3'));
            this.effectFlag = 0;
        }

        if(this.wheelState == 1)
        {
            // console.log('....加速,speed:' + this.curSpeed);
            this.spinTime += dt;
            this.wheelSp.node.rotation = this.wheelSp.node.rotation + this.curSpeed;
            if(this.curSpeed <= this.maxSpeed)
            {
                this.curSpeed += this.acc;
            }
            else
            {
                if(this.spinTime<this.duration)
                {
                    return;
                }
                // console.log('....开始减速');
                //设置目标角度
                this.finalAngle = 360-this.targetID*this.gearAngle + this.defaultAngle;
                this.maxSpeed = this.curSpeed;
                if(this.springback)
                {
                    this.finalAngle += this.gearAngle;
                }
                this.wheelSp.node.rotation = this.finalAngle;
                this.wheelState = 2;
            }
        }
        else if(this.wheelState == 2)
        {
            // console.log('......减速');
            var curRo = this.wheelSp.node.rotation; //应该等于finalAngle
            var hadRo = curRo - this.finalAngle;
            this.curSpeed = this.maxSpeed*((this.decAngle-hadRo)/this.decAngle) + 0.2; 
            this.wheelSp.node.rotation = curRo + this.curSpeed;

            if((this.decAngle-hadRo)<=0)
            {  
                console.log('....停止');
                this.wheelState = 0;
                this.wheelSp.node.rotation = this.finalAngle;
                if(this.springback)
                {
                    //倒转一个齿轮
                    // var act = new cc.rotateBy(0.6, -this.gearAngle);
                    var act = cc.rotateBy(0.6, -this.gearAngle);
                    var seq = cc.sequence(cc.delayTime(0.2),act,cc.callFunc(this.showRes, this));
                    this.wheelSp.node.runAction(seq);
                }
                else
                {
                    this.showRes();
                }
            }
        }
    },

    showRes:function()
    {
        // if (cc.sys.isBrowser) {
            console.log('You have got ' + this.targetID);
            this.com.setAchive(5, this.node);

            if (this.awardInfo.reward == 1){
                this.com.saveData.gold += this.awardInfo.rewardNum;
                this.com.setComData("gold", this.com.saveData.gold);
                this.node.dispatchEvent(new cc.Event.EventCustom("upGold", true));
            } else if (this.awardInfo.reward == 2){
                this.com.saveData.diamond += this.awardInfo.rewardNum;
                this.com.setComData("diamond", this.com.saveData.diamond);
                this.node.dispatchEvent(new cc.Event.EventCustom("upDiamond", true));
            } else if (this.awardInfo.reward == 3){
                this.com.saveData.gift += this.awardInfo.rewardNum;
                this.com.setComData("gift", this.com.saveData.gift);
                this.node.dispatchEvent(new cc.Event.EventCustom("upGift", true));
            } else if (this.awardInfo.reward == 4){
                this.popup.tip(this.node, "再来一次!");
                return;
            }

            //标记已领取
            this._times++;
            this.upDailyReward();

            var lyAward = cc.instantiate(this.dlgAward);
            lyAward.parent = this.node;
            lyAward.getComponent("dlgAward").init(this.awardInfo.reward, this.awardInfo.rewardNum);
        // } else {
        //     console.log("showRes=" + this.targetID);
        // }
    },

    getFollowGame: function() {
        var self = this;

        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            gameType: this.com.project_name,
            usrId: usrId
        };
        var token = cc.sys.localStorage.getItem("Token");
        this.httpUtils._instance.httpPost(this.com.serverUrl + '/user/getFollowGame', JSON.stringify(params), function(data){
            var jsonD = JSON.parse(data);
            var lingqu = self.node.getChildByName("follow").getChildByName("lingqu");
            if (jsonD["errcode"] == 0){
                lingqu.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(self.com.res_loaded["png_huodong_guanzhuyouli_yilingqu"]);
                lingqu.getComponent(cc.Button).enabled = false;
            } else {
                lingqu.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(self.com.res_loaded["png_huodong_guanzhuyouli_lingqu"]);
            }
        }, token);
    },

    upFollowGame: function() {
        var lingqu = this.node.getChildByName("follow").getChildByName("lingqu");
        if (!lingqu.getComponent(cc.Button).enabled) return;

        var self = this;

        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            gameType: this.com.project_name,
            usrId: usrId
        };
        var token = cc.sys.localStorage.getItem("Token");
        this.httpUtils._instance.httpPost(this.com.serverUrl + '/user/upFollowGame', JSON.stringify(params), function(data){
            var jsonD = JSON.parse(data);
            if (jsonD["errcode"] == 0){
                console.log("关注游戏成功！")
                lingqu.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(self.com.res_loaded["png_huodong_guanzhuyouli_yilingqu"]);

                self.com.setComData("diamond", self.com.saveData.diamond + self.com.getParam("1012").param);

                self.node.dispatchEvent(new cc.Event.EventCustom("upDiamond", true));

                self.com.setAchive(6, self.node);
            } else {
                console.log(jsonD.msg);
                lingqu.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(self.com.res_loaded["png_huodong_guanzhuyouli_yilingqu"]);
            }
        }, token);
    },

    statusBtn: function(){
        var gengduofuli = this.node.getChildByName("gengduofuli").getComponent(cc.Button);
        var guanzhuyouli = this.node.getChildByName("guanzhuyouli").getComponent(cc.Button);
        var meirizhuanpan = this.node.getChildByName("meirizhuanpan").getComponent(cc.Button);
        var tiantianyouli = this.node.getChildByName("tiantianyouli").getComponent(cc.Button);
        var xinshoujiangli = this.node.getChildByName("xinshoujiangli").getComponent(cc.Button);

        gengduofuli.enabled = true;
        guanzhuyouli.enabled = true;
        meirizhuanpan.enabled = true;
        tiantianyouli.enabled = true;
        xinshoujiangli.enabled = true;

        this.node.getChildByName("wheel").x = 10000;
        this.node.getChildByName("active").x = 10000;
        this.node.getChildByName("follow").x = 10000;
        this.node.getChildByName("dailyShare").x = 10000;
        this.node.getChildByName("loginShare").x = 10000;

        if (this._curBtn == 2){
            gengduofuli.enabled = false;
            gengduofuli.node.scale = 1.2;
            this.node.getChildByName("active").x = 0;

            this.activeScrollViewContent.removeAllChildren(true);
            for (var i=0; i<this.com.cfgOtherGame.length; i++){
                var activeItem = cc.instantiate(this.activeItem);
                this.activeScrollViewContent.addChild(activeItem);
                activeItem.getComponent('LyActiveItem').init(this.com.cfgOtherGame[i]);
            }
        }

        if (this._curBtn == 1){
            guanzhuyouli.enabled = false;
            guanzhuyouli.node.scale = 1.2;
            this.node.getChildByName("follow").x = 0;

            this.getFollowGame();
        }

        if (this._curBtn == 0){
            meirizhuanpan.enabled = false;
            meirizhuanpan.node.scale = 1.2;
            this.node.getChildByName("wheel").x = 0;
        }

        if (this._curBtn == 4){
            xinshoujiangli.enabled = false;
            xinshoujiangli.node.scale = 1.2;
            this.node.getChildByName("dailyShare").x = 0;

            var this_ = this;

            var usrId = cc.sys.localStorage.getItem("usrId");
            var params = {
                usrId: usrId,
            };
            var token = cc.sys.localStorage.getItem("Token");
            var url = this.com.serverUrl + "/user/getLoginShareCooking";
            this.httpUtils._instance.httpPost(url, JSON.stringify(params), function(data){
                var jsonD = JSON.parse(data);
                console.log(jsonD);

                var num = this_.node.getChildByName("dailyShare").getChildByName("num").getComponent(cc.RichText);
                if (jsonD["errcode"] === 0){
                    if (jsonD.data >= 3){
                        var btn = this_.node.getChildByName("dailyShare").getChildByName("lijiyaoqing").getComponent(cc.Button);
                        btn.enabled = false;
                    }
                    var data = jsonD.data > 3 ? 3 : jsonD.data;
                    num.string = "<outline color=#ffffff width=1>当前已邀请: " + data.toString() + "/3</outline>";
                } else {
                    num.string = "<outline color=#ffffff width=1>当前已邀请: 0/3</outline>";
                }
            }, token);
        }

        if (this._curBtn == 3){
            tiantianyouli.enabled = false;
            tiantianyouli.node.scale = 1.2;
            this.node.getChildByName("loginShare").x = 0;

            var this_ = this;

            var usrId = cc.sys.localStorage.getItem("usrId");
            var params = {
                usrId: usrId,
            };
            var token = cc.sys.localStorage.getItem("Token");
            var url = this.com.serverUrl + "/user/getDailyShare";
            this.httpUtils._instance.httpPost(url, JSON.stringify(params), function(data){
                var jsonD = JSON.parse(data);
                console.log(jsonD);

                var btn = this_.node.getChildByName("loginShare").getChildByName("lingqu_anniuda").getComponent(cc.Button);
                if (jsonD["errcode"] === 0 && Number(jsonD.data) > 0){
                    btn.enabled = false;
                }
            }, token);
        }
    },

    btnWheel: function(event, coustEvent) {
        if (this._curBtn == 0)
            return;

        this._curBtn = 0;
        this.statusBtn();
    },

    btnFollow: function(event, coustEvent) {
        if (this._curBtn == 1)
            return;

        this._curBtn = 1;
        this.statusBtn();
    },

    btnWelfare: function(event, coustEvent) {
        if (this._curBtn == 2)
            return;

        this._curBtn = 2;
        this.statusBtn();
    },

    btnSelect: function(event, coustEvent) {
        var gouxuan = this.node.getChildByName("wheel").getChildByName("gouxuan");
        if (this._select){
            gouxuan.active = false;
            this._select = false;
        } else {
            gouxuan.active = true;
            this._select = true;
        }
    },

    btnFollowGame: function(event, customData){
        var self = this;

        if (CC_WECHATGAME) wx.aldSendEvent('关注有礼', {});

        if (CC_WECHATGAME){
            wx.setMenuStyle({
                style: 'light', 
                success(res){
                    self.upFollowGame();
                }
            });
        } else {
            this.upFollowGame();
        }
    },

    btnDailyShare: function(event, customData){
        if (this._curBtn == 3)
            return;

        this._curBtn = 3;
        this.statusBtn();
    },

    btnLoginShare: function(event, customData){
        if (this._curBtn == 4)
            return;

        this._curBtn = 4;
        this.statusBtn();
    },

    btnDailyShareClick: function(event, customData){
        if (!CC_WECHATGAME) return;

        if (CC_WECHATGAME) wx.aldSendEvent('天天有礼-分享', {});

        var btn = this.node.getChildByName("loginShare").getChildByName("lingqu_anniuda").getComponent(cc.Button);
        btn.enabled = false;

        var self = this;

        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId,
        };
        var token = cc.sys.localStorage.getItem("Token");
        var url = this.com.serverUrl + "/user/upDailyShare";
        this.httpUtils._instance.httpPost(url, JSON.stringify(params), function(data){
            var jsonD = JSON.parse(data);
            console.log(jsonD);

            if (jsonD["errcode"] === 0){
                var dlg = cc.instantiate(self.dlgAwardShare);
                dlg.parent = self.node;
                dlg.getComponent('dlgAwardShare').init(1, 1000, 3, 2);

                self.com.saveData.gold += 1000;
                self.com.setComData("gold", self.com.saveData.gold);
                self.node.dispatchEvent(new cc.Event.EventCustom("upGold", true));

                self.com.saveData.gift += 2;
                self.com.setComData("gift", self.com.saveData.gift);
                self.node.dispatchEvent(new cc.Event.EventCustom("upGift", true));
            }
        }, token);

        wx.updateShareMenu({
            withShareTicket: false
        });
        cc.loader.loadRes("texture/share",function(err,data){
            wx.shareAppMessage({
                title: "抖音上超火的网红游戏",
                imageUrl: data.url,
                success(res){
                    console.log("转发成功!!!");
                },
                fail(res){
                    console.log("转发失败!!!");
                } 
            })
        });
    },

    btnLoginShareClick: function(event, customData){
        if (!CC_WECHATGAME) return;
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
                    wx.aldSendEvent('邀请好友-分享成功',{});
                },
                fail(res){
                    console.log("转发失败!!!" + JSON.stringify(res));
                    wx.aldSendEvent('邀请好友-分享失败',{});
                } 
            })
        });
    },

    btnClose: function(event, coustEvent) {
        if(this.node_anim) this.node.stopAction(this.node_anim);
        this.node.dispatchEvent(new cc.Event.EventCustom("closeActive", true));

        this.node.removeFromParent(true);
    },

    onDestory:function(){
        if(this._videoAd){
            this._videoAd.offClose(this.vedioPlayOver1);
        }
    },
});