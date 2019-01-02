var com = require('common');

cc.Class({
    extends: cc.Component,

    properties: {
        m_lbSellFood: cc.Label,
        m_lbPraise: cc.Label,
        m_lbPeople: cc.Label,
        m_overAudio: {
            default: null,
            url: cc.AudioClip
        },
        m_animate: sp.Skeleton,
        m_dlgAward: cc.Prefab,
        m_vedioBtn: cc.Button,

        m_bgm: {
            default: null,
            url: cc.AudioClip
        }
    },

    onLoad () {
        this.com = require('common');
        this.httpUtils = require("httpUtils");

        this.node.on('closeAward', this.closeAward, this);

        this.com.loadTexture(this.node, ["renwu"], "png_renwu");
        this.com.loadTexture(this.node, ["panel_node","beijng"], "png_yuemubiaodacheng");
        this.com.loadTexture(this.node, ["panel_node","spPraise"], "png_yuemubiao_shoudaohaoping");
        this.com.loadTexture(this.node, ["panel_node","spSellFood"], "png_yuemubiao_muchushiwu");
        this.com.loadTexture(this.node, ["panel_node","spPeople"], "png_yuemubiao_fuwuguke");
        //this.com.loadTexture(this.node, ["panel_node","pic_gold3"], "png_jiangbei_jinbi");
        this.com.loadTexture(this.node, ["panel_node","btnGroupRank"], "png_btn_getit");
        this.com.loadTexture(this.node, ["panel_node","btn_double"], "png_btn_double");
        this.com.loadTexture(this.node, ["panel_node","xinshijian_cha"], "png_btn_thanks");
    },

    init: function(data){
        cc.audioEngine.playEffect(this.m_overAudio, false);

        console.log("卖出的食物="+data.foods);
        console.log("完成订单数量="+data.orderNum);
        console.log("服务的人数="+data.peopleNum);
        console.log("点赞的人数="+data.praisePeople);
        console.log("浪费的食物数量="+data.wasteFoods);
        console.log("小费数="+data.feeGold);
        console.log("点赞数量(事件增加)="+data.praise);
        console.log("金币数="+data.gold);
        var fin = [data.foods, data.praise, data.orderNum];
        var ret = [0,0,0];

        for (var j=0; j<3; j++){
            var t = this.com.getNewScoreById(j+1);
            for (var i=1; i<=5; i++)
            {
                var val = t["lv" + i];
                if (fin[j] >= val){
                    ret[j]++;
                } else {
                    break;
                }
            }
        }
        console.log(ret);
        
        this.panel_node = this.node.getChildByName("panel_node");
        for (var i=0; i<3; i++){
            if (ret[i] == 1) {
                this.panel_node.getChildByName("starFrame_" + i).getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_yuemubiao_xingxing"]);
            } else if (ret[i] == 2){
                this.panel_node.getChildByName("starFrame_" + i).getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_yuemubiao_moon"]);
            } else if (ret[i] == 3){
                this.panel_node.getChildByName("starFrame_" + i).getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_yuemubiao_sun"]);
            } else if (ret[i] == 4){
                this.panel_node.getChildByName("starFrame_" + i).getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_yuemubiao_king"]);
            } else if (ret[i] == 5){
                this.panel_node.getChildByName("starFrame_" + i).getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_yuemubiao_queen"]);
            }
        }

        this.m_lbSellFood.string = data.foods;
        this.m_lbPraise.string = data.praise;
        this.m_lbPeople.string = data.orderNum;

        this.updateScore(this.com.saveData.praise);
        this.updateGold(this.com.saveData.gold);

        if (CC_WECHATGAME && this.com.isSave) {
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "Cooking_praise",
                data: {
                    des: cc.sys.localStorage.getItem("myDes"),
                    sex: cc.sys.localStorage.getItem("mySex"),
                    score: this.com.saveData.praise
                }
            });
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "Cooking_fans",
                data: {
                    des: cc.sys.localStorage.getItem("myDes"),
                    sex: cc.sys.localStorage.getItem("mySex"),
                    score: this.com.saveData.gold
                }
            });
        }

        var renwu = this.node.getChildByName('renwu');
        var starFrame_0 = this.panel_node.getChildByName('starFrame_0');
        var spSellFood = this.panel_node.getChildByName('spSellFood');
        var label0 = this.panel_node.getChildByName('label0');
        var starFrame_1 = this.panel_node.getChildByName('starFrame_1');
        var spPraise = this.panel_node.getChildByName('spPraise');
        var label1 = this.panel_node.getChildByName('label1');
        var starFrame_2 = this.panel_node.getChildByName('starFrame_2');
        var spPeople = this.panel_node.getChildByName('spPeople');
        var label2 = this.panel_node.getChildByName('label2');
        var pic_gold3 = this.panel_node.getChildByName('pic_gold3');
        var pic_gold31 = this.panel_node.getChildByName('pic_gold31');
        var richtext01 = this.panel_node.getChildByName('richtext01');
        var richtext1 = this.panel_node.getChildByName('richtext1');
        var richtext02 = this.panel_node.getChildByName('richtext02');
        var richtext2 = this.panel_node.getChildByName('richtext2');
        var btnGroupRank = this.panel_node.getChildByName('btnGroupRank');
        var xinshijian_cha = this.panel_node.getChildByName('xinshijian_cha');
        var btn_double = this.panel_node.getChildByName('btn_double');
        
        this.panel_node.setPosition(cc.v2(0, cc.winSize.height));
        this.m_animate.node.x = -1000;
        starFrame_0.x = -1000;
        spSellFood.x = -1000;
        label0.x = -1000;
        starFrame_1.x = -1000;
        spPraise.x = -1000;
        label1.x = -1000;
        starFrame_2.x = -1000;
        spPeople.x = -1000;
        label2.x = -1000;
        pic_gold3.x = -1000;
        pic_gold31.x = -1000;
        richtext01.x = -1000;
        richtext1.x = -1000;
        richtext02.x = -1000;
        richtext2.x = -1000;
        btnGroupRank.x = -1000;
        xinshijian_cha.x = -1000;
        btn_double.x = -1000;

        var this_ = this;
        var interval = 1.0;
        renwu.runAction(cc.sequence(
            cc.moveTo(interval - 0.5, cc.p(-469.4, -120.5)),
            cc.callFunc(function(target, customData){
                this_.node_anim = this_.panel_node.runAction(cc.sequence(
                    cc.moveTo(0.3, cc.p(0,0)).easing(cc.easeIn(0.3)),
                    cc.moveBy(0.15, cc.p(0,60)),
                    cc.moveBy(0.15, cc.p(0,-60)),
                    cc.callFunc(function(){
                        renwu.x = 1000;
                        this_.m_animate.node.x = -495;
                        if (ret[0] > 1){
                            this_.m_animate.getComponent(sp.Skeleton).animation = "dagaoxin";    
                        } else {
                            this_.m_animate.getComponent(sp.Skeleton).animation = "gaoxin";
                        }
                        starFrame_0.runAction(cc.sequence(
                            cc.moveTo(interval, cc.p(-210,104)),
                            cc.callFunc(function(){
                                if (ret[1] > 1){
                                    this_.m_animate.getComponent(sp.Skeleton).animation = "dagaoxin";    
                                } else {
                                    this_.m_animate.getComponent(sp.Skeleton).animation = "gaoxin";
                                }

                                starFrame_1.runAction(cc.sequence(
                                    cc.moveTo(interval, cc.p(-51,151)),
                                    cc.callFunc(function(){
                                        if (ret[2] > 1){
                                            this_.m_animate.getComponent(sp.Skeleton).animation = "dagaoxin";    
                                        } else {
                                            this_.m_animate.getComponent(sp.Skeleton).animation = "gaoxin";
                                        }

                                        starFrame_2.runAction(cc.sequence(
                                            cc.moveTo(interval, cc.p(108,143)),
                                            cc.delayTime(interval - 0.5),
                                            cc.callFunc(function(){
                                                renwu.x = -469.4;
                                                this_.m_animate.node.x = 1000;
                                                richtext01.x = -159.8;
                                                pic_gold3.x = 22.4;
                                                richtext1.x = 45.3;
                                                richtext1.getComponent(cc.RichText).string = "<b>" + data.gold + "</b>";
                                                this_.gold = 0;
                                                for (var j=0; j<3; j++){
                                                    if (ret[j] == 1){
                                                        this_.gold += data.gold * Number(this_.com.getParam(1018).param);
                                                    } else if (ret[j] == 2){
                                                        this_.gold += data.gold * Number(this_.com.getParam(1019).param);
                                                    } else if (ret[j] == 3){
                                                        this_.gold += data.gold * Number(this_.com.getParam(1020).param);
                                                    } else if (ret[j] == 4){
                                                        this_.gold += data.gold * Number(this_.com.getParam(1021).param);
                                                    } else if (ret[j] == 5){
                                                        this_.gold += data.gold * Number(this_.com.getParam(1022).param);
                                                    }
                                                }
                                                this_.gold = Math.floor(this_.gold);
                                                richtext02.x = -154.1;
                                                pic_gold31.x = 30.1;
                                                richtext2.x = 55;
                                                richtext2.getComponent(cc.RichText).string = "<b>" + this_.gold + "</b>";
                                                btn_double.x = 133;
                                                btnGroupRank.x = -135.4;
                                                xinshijian_cha.runAction(cc.sequence(
                                                    cc.delayTime(1.5),
                                                    cc.callFunc(function(){
                                                        xinshijian_cha.x = 147.4;
                                                    })
                                                ))
                                            })
                                        ));

                                        spPeople.runAction(cc.moveTo(interval, cc.p(118,20.8)));
                                        label2.getComponent(cc.Label).string = "X" + fin[2];
                                        label2.runAction(cc.moveTo(interval, cc.p(121.7,-38.7)));
                                    })
                                ));        
                                spPraise.runAction(cc.moveTo(interval, cc.p(-36.5,32.3)));
                                label1.getComponent(cc.Label).string = "X" + fin[1];
                                label1.runAction(cc.moveTo(interval, cc.p(-34,-24.8)));
                            })
                        ));
                        spSellFood.runAction(cc.moveTo(interval, cc.p(-189.6,-14.7)));
                        label0.getComponent(cc.Label).string = "X" + fin[0];
                        label0.runAction(cc.moveTo(interval, cc.p(-185.8,-79.7)));
                    })
                ));
            })
        ));
    },

    updateScore: function(score){
        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId,
            score: score,
        };
        var token = cc.sys.localStorage.getItem("Token");
        var url = this.com.serverUrl + "/user/score";
        this.httpUtils._instance.httpPost(url, JSON.stringify(params), function(data){
            var jsonD = JSON.parse(data);
            console.log(jsonD.msg)
        }, token);
    },

    updateGold: function(gold){
        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId,
            gold: gold,
        };
        var token = cc.sys.localStorage.getItem("Token");
        var url = this.com.serverUrl + "/user/upRankOfGolds";
        this.httpUtils._instance.httpPost(url, JSON.stringify(params), function(data){
            var jsonD = JSON.parse(data);
            console.log(jsonD.msg)
        }, token);
    },

    btnClose: function(event, coustEvent) {
        if (this.gold > 0){
            var lyAward = cc.instantiate(this.m_dlgAward);
            lyAward.parent = this.node;
            lyAward.getComponent("dlgAward").init(1, this.gold);

            this.com.saveData.gold += this.gold;
            this.com.setComData("gold", this.com.saveData.gold);
            this.node.dispatchEvent(new cc.Event.EventCustom("upGold", true));
        } else {
            this.closeAward();
        }
    },

    btn_qunpaihang: function(event, coustEvent) {
        if (!CC_WECHATGAME) return;

        if (this.gold > 0){
            var lyAward = cc.instantiate(this.m_dlgAward);
            lyAward.parent = this.node;
            lyAward.getComponent("dlgAward").init(1, this.gold);

            this.com.saveData.gold += this.gold;
            this.com.setComData("gold", this.com.saveData.gold);
            this.node.dispatchEvent(new cc.Event.EventCustom("upGold", true));
        } else {
            this.closeAward();
        }

        cc.loader.loadRes("texture/share",function(err,data){
            wx.updateShareMenu({
                withShareTicket: true
            });
            wx.shareAppMessage({
                title: "抖音上超火的网红游戏",
                imageUrl: data.url,
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

    btn_double: function(event, coustEvent) {
        if (!CC_WECHATGAME) return;

        this.com.monthOverScript = this;
        this.m_vedioBtn.interactable = false;

        if(!this._videoAd){
            this._videoAd = wx.createRewardedVideoAd({ adUnitId: 'adunit-8daba22adfefa58f' });
        }
        this._videoAd.onClose(this.vedioPlayOver1);
        var music = cc.sys.localStorage.getItem("CloseMusic");
        if(music == 1){
            cc.audioEngine.stopAll();; //停止背景音乐
        }
        this._videoAd.load().then(() => this._videoAd.show()).catch(err => console.log(err.errMsg));
    },

    vedioPlayOver1: function(res){
        let this_ = com.monthOverScript;
        // 用户点击了【关闭广告】按钮
        // 小于 2.1.0 的基础库版本，res 是一个 undefined
        if (res && res.isEnded || res === undefined) {
            // 正常播放结束，可以下发游戏奖励
            // wx.aldSendEvent('游戏视频成功',{});

            if (CC_WECHATGAME) wx.aldSendEvent('月末结算-看激励广告', {});

            this_.afterVedio();
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
        this_.m_vedioBtn.interactable = true;
    },

    afterVedio: function(){
        if (this.gold > 0){
            var lyAward = cc.instantiate(this.m_dlgAward);
            lyAward.parent = this.node;
            lyAward.getComponent("dlgAward").init(1, this.gold*2);

            this.com.saveData.gold += this.gold*2;
            this.com.setComData("gold", this.com.saveData.gold);
            this.node.dispatchEvent(new cc.Event.EventCustom("upGold", true));
        } else {
            this.closeAward();
        }
    },

    closeAward: function(event){
        if(this.node_anim) this.panel_node.stopAction(this.node_anim);
        this.node.dispatchEvent(new cc.Event.EventCustom("showClose", true));

        this.node.removeFromParent(true);
    },
});
