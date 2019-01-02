cc.Class({
    extends: cc.Component,

    properties: {
        m_customer: cc.Prefab,
        m_workbench: cc.Prefab,
        m_dishes: cc.Prefab,
        m_monthover: cc.Prefab,
        m_updateShop: cc.Prefab,
        m_wheel: cc.Prefab,
        m_evtIcon: cc.Prefab,
        m_lyEvtInfo: cc.Prefab,
        m_achivement: cc.Prefab,
        m_gam: cc.Prefab,
        m_rank: cc.Prefab,
        m_friendUI: cc.Prefab,
        m_friendOver: cc.Prefab,
        m_dlg: cc.Prefab,
        m_newbie: cc.Prefab,
        m_policy: cc.Prefab,
        m_loginAward: cc.Prefab,
        m_dlgGiveGold: cc.Prefab,
        m_lbMonth: cc.RichText,
        m_lbMonthTargetV: cc.RichText,
        m_pgMonthTarget: cc.ProgressBar,
        m_ndMonthEvt: cc.Node,
        m_lbGold: cc.Label,
        m_lbDiamond: cc.Label,
        m_lbPraise: cc.Label,
        m_lbGift: cc.RichText,
        m_ndRecycle: cc.Node,
        m_reciveGoldAudio: {
            default: null,
            url: cc.AudioClip
        },
        m_reciveFeeAudio: {
            default: null,
            url: cc.AudioClip
        },
        m_FluctuateOverAudio: {
            default: null,
            url: cc.AudioClip
        },

        m_BarbecueAudio: {
            default: null,
            url: cc.AudioClip
        },

        m_peopleCurFlu: 0,                  //当前波的人数
        m_maxFluctuatePeople: 0,            //当前波最大人数
        m_peopleAppearTime: 0,              //出现人的计时
        m_peopleAppearBlanking: 0,          //出现人的间隔
        m_peopleNum: 0,                     //统计本月人数
        m_praise: 0,                        //统计本月好评数
        m_praiseExt: 0,                     //统计额外的好评数
        m_orderNum: 0,                      //统计本月完成的订单数
        m_foods:0,                          //统计本月卖出的食物数量
        m_wasteFoods:0,                     //统计浪费的食物
        m_feeGold:0,                        //统计小费的数量
        m_gold: 0,                          //统计本月金币
        m_run: false,

        // m_bgm: {
        //     default: null,
        //     url: cc.AudioClip
        // }
    },

    onLoad () {
        var this_ = this;
        this.com = require('common');
        this.httpUtils = require("httpUtils");
        this.popup = require('popup');
        this.node.on('customerLeave', this.customerLeave, this);
        this.node.on('wasteDishes', this.wasteDishes, this);
        this.node.on('showClose', this.showClose, this);
        this.node.on('closeShop', this.closeShop, this);
        this.node.on('upgradeItem', this.upgradeItem, this);
        this.node.on('closeActive', this.closeActive, this);
        this.node.on('showEvtInfo', this.showEvtInfo, this);
        this.node.on('closeEvtInfo', this.closeEvtInfo, this);
        this.node.on('closeMonthTargetInfo', this.closeMonthTargetInfo, this);
        this.node.on('closeAchivement', this.closeAchivement, this);
        this.node.on('closeGam', this.closeGam, this);
        this.node.on('closeRank', this.closeRank, this);
        this.node.on('helpFriend', this.helpFriend, this);
        this.node.on('upGold', this.upGold, this);
        this.node.on('upDiamond', this.upDiamond, this);
        this.node.on('upGift', this.upGift, this);
        this.node.on('show_dlg', this.show_dlg, this);
        this.node.on('closeLoginAward', this.closeLoginAward, this);
        this.node.on('resumeGame', this.resumeGame, this);
        this.node.on('resumeGame', this.closeDlg, this);

        this._maxMachineNum = 3;

        this.com.loadTexture(this.node, ["gold1"], "png_gold");
        this.com.loadTexture(this.node, ["diamond1"], "png_jiangbei_zuanshi");
        this.com.loadTexture(this.node, ["praise1"], "png_xin");
        this.com.loadTexture(this.node, ["people1"], "png_people");
        this.com.loadTexture(this.node, ["houjing"], "jpg_bg2");
        this.com.loadTexture(this.node, ["qianjing","zhuotai_shang"], "png_zhuotai_shang");
        this.com.loadTexture(this.node, ["qianjing","zhuotai_down"], "png_zhuotai_down");
        this.com.loadTexture(this.node, ["qianjing","zhuotai_xia"], "png_zhuotai_xia");
        this.com.loadTexture(this.node, ["qianjing","recycle"], "png_lajitong");
        this.com.loadTexture(this.node, ["monthTarget","bg"], "png_zhujiemian_fangke_hengtiao");
        this.com.loadTexture(this.node, ["monthTarget","tubiao"], "png_zhujiemian_fangke_tubiao");
        
        var mask = this.node.getChildByName("monthTarget").getChildByName("mask");
        mask.getComponent(cc.Mask).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_zhujiemian_fangke_hengtiao2"]);

        this.com.loadTexture(this.node, ["monthTarget","mask","progressBar"], "png_zhujiemian_fangke_jingdu");
        this.com.loadTexture(this.node, ["gold","bg"], "png_zhujiemian_jinbi");
        this.com.loadTexture(this.node, ["gold","button"], "png_zhujiemian_jia");
        this.com.loadTexture(this.node, ["diamond","bg"], "png_zhujiemian_zuanshi");
        this.com.loadTexture(this.node, ["diamond","button"], "png_zhujiemian_jia");
        this.com.loadTexture(this.node, ["praise","bg"], "png_zhujiemian_aixin");
        this.com.loadTexture(this.node, ["close"], "png_close");
        this.com.loadTexture(this.node, ["close","button"], "png_closed_xiageyue");
        this.com.loadTexture(this.node, ["close","qianwang1"], "png_qianwang1");
        this.com.loadTexture(this.node, ["mubu","mubu_l"], "png_mubu");
        this.com.loadTexture(this.node, ["mubu","mubu_r"], "png_mubu");
        this.com.loadTexture(this.node, ["gift"], "png_zhujiemian_binqilin");
        this.com.loadTexture(this.node, ["btnPause"], "png_zhujiemian_shengjidianpu");
        this.com.loadTexture(this.node, ["shejiao"], "png_zhujiemian_shejiao");
        this.com.loadTexture(this.node, ["chengjiu"], "png_zhujiemian_chengjiu");
        this.com.loadTexture(this.node, ["paihangbang"], "png_zhujiemian_paihangbang");
        this.com.loadTexture(this.node, ["shijie"], "png_zhujiemian_shijie");
        this.com.loadTexture(this.node, ["huodong"], "png_zhujiemian_huodong");
        this.com.loadTexture(this.node, ["month","monthBG"], "png_monthBG");

        if (CC_WECHATGAME) {
            window.wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
            cc.loader.loadRes("texture/share",function(err,data){
                wx.onShareAppMessage(function(res){
                    return {
                        title: "抖音上超火的网红游戏",
                        imageUrl: data.url,
                        success(res){
                            console.log("转发成功!!!")
                            if (CC_WECHATGAME) {
                                // wx.aldSendEvent('游戏页面分享成功',{});
                            }
                            this_.com.setAchive(7, this_.node);
                        },
                        fail(res){
                            console.log("转发失败!!!")
                            if (CC_WECHATGAME) {
                                // wx.aldSendEvent('游戏页面分享失败',{});
                            }
                        } 
                    }
                })
            });
        }

        //
        if (this.com.isSave){
            var usrId = cc.sys.localStorage.getItem("usrId");
            var params = {
                usrId: usrId,
            };
            var token = cc.sys.localStorage.getItem("Token");
            var url = this.com.serverUrl + "/user/getLoginShareCooking";
            this.httpUtils._instance.httpPost(url, JSON.stringify(params), function(data){
                var jsonD = JSON.parse(data);
                console.log(jsonD);

                var num = 0;
                if (jsonD["errcode"] === 0){
                    num = Number(jsonD.data);
                }

                this_.pauseGame();
                this_._getLoginAward = 0;

                if (!this_.com.saveData.loginShare){
                    this_.com.setComData("loginShare", [0,0,0]);
                }
                // console.log(this_.com.saveData.loginShare);
                // console.log(num);
                // console.log(this_.com.saveData.loginShare[0]);

                if (this_.com.saveData.loginShare[0] == 0 && num >= 1){
                    var dlg = cc.instantiate(this_.m_loginAward);
                    dlg.parent = this_.node;
                    dlg.getComponent('dlgAwardLogin').init(1, 3000, 2, 50, 3, 3, 1);

                    this_.com.saveData.gold += 3000;
                    this_.com.setComData("gold", this_.com.saveData.gold);
                    this_.m_lbGold.string = this_.com.saveData.gold;

                    this_.com.saveData.diamond += 50;
                    this_.com.setComData("diamond", this_.com.saveData.diamond);
                    this_.m_lbDiamond.string = this_.com.saveData.diamond;

                    this_.com.saveData.gift += 3;
                    this_.com.setComData("gift", this_.com.saveData.gift);
                    this_.m_lbGift.string = this_.com.saveData.gift;

                    this_.com.setComData("loginShare", [1,0,0]);
                    this_._getLoginAward++;
                }
                if (this_.com.saveData.loginShare[1] == 0 && num >= 2){
                    var dlg = cc.instantiate(this_.m_loginAward);
                    dlg.parent = this_.node;
                    dlg.getComponent('dlgAwardLogin').init(1, 5000, 2, 100, 3, 6, 2);

                    this_.com.saveData.gold += 5000;
                    this_.com.setComData("gold", this_.com.saveData.gold);
                    this_.m_lbGold.string = this_.com.saveData.gold;

                    this_.com.saveData.diamond += 100;
                    this_.com.setComData("diamond", this_.com.saveData.diamond);
                    this_.m_lbDiamond.string = this_.com.saveData.diamond;

                    this_.com.saveData.gift += 6;
                    this_.com.setComData("gift", this_.com.saveData.gift);
                    this_.m_lbGift.string = this_.com.saveData.gift;

                    this_.com.setComData("loginShare", [1,1,0]);
                    this_._getLoginAward++;
                }
                if (this_.com.saveData.loginShare[2] == 0 && num >= 3){
                    var dlg = cc.instantiate(this_.m_loginAward);
                    dlg.parent = this_.node;
                    dlg.getComponent('dlgAwardLogin').init(1, 10000, 2, 150, 3, 10, 3);

                    this_.com.saveData.gold += 10000;
                    this_.com.setComData("gold", this_.com.saveData.gold);
                    this_.m_lbGold.string = this_.com.saveData.gold;

                    this_.com.saveData.diamond += 150;
                    this_.com.setComData("diamond", this_.com.saveData.diamond);
                    this_.m_lbDiamond.string = this_.com.saveData.diamond;

                    this_.com.saveData.gift += 10;
                    this_.com.setComData("gift", this_.com.saveData.gift);
                    this_.m_lbGift.string = this_.com.saveData.gift;

                    this_.com.setComData("loginShare", [1,1,1]);
                    this_._getLoginAward++;
                }

                if (this_._getLoginAward <= 0 && !this_._loginShowActive){
                    this_.resumeGame();
                }
            }, token);
        }

        if (CC_WECHATGAME){
            //let btnSize = cc.size(btnNode.width+10,btnNode.height+10);
            let frameSize = cc.view.getFrameSize();
            let winSize = cc.director.getWinSize();
            // console.log("winSize: ",winSize);
            // console.log("frameSize: ",frameSize);
            //适配不同机型来创建微信授权按钮
            //let left = (winSize.width*0.5+btnNode.x-btnSize.width*0.5)/winSize.width*frameSize.width;
            //let top = (winSize.height*0.5-btnNode.y-btnSize.height*0.5)/winSize.height*frameSize.height;
            //let width = btnSize.width/winSize.width*frameSize.width;
            //let height = btnSize.height/winSize.height*frameSize.height;
            let left = (10+40*0.5)/winSize.width*frameSize.width;
            let top = (winSize.height-10-40*0.5-90)/winSize.height*frameSize.height;

            this.button = wx.createGameClubButton({
                icon: 'green',
                style: {
                    left: left,
                    top: top,
                    width: 40,
                    height: 40
                },
            });
        }
    },

    start () {
        if (this.com.isSave){
            this.reset();
        } else {
            this.initFriend();
        }
    },

    initFriend: function(){
        this.initDesk();

        var drinkDispenser = cc.instantiate(this.m_workbench);
        drinkDispenser.parent = this.node.getChildByName("drinkDispenser");
        drinkDispenser.setPosition(cc.p(0,0));

        var jzl = this.com.saveData.shopItem["250"];
        if (jzl){
            var dumplingDispenser = cc.instantiate(this.m_workbench);
            dumplingDispenser.parent = this.node.getChildByName("dumplingDispenser");
            dumplingDispenser.setPosition(cc.p(0,0));
        }

        this.com.monthEvtInfo = [];
        this.m_ndMonthEvt.removeAllChildren(true);

        this.com.fluctuate = 1;
        // console.log("当前波数：" + this.com.fluctuate);
        // if (this.com.saveData.month > 1){
        //     this.initMonthEvt();
        // }

        this.m_peopleCurFlu = 0;
        this.m_peopleAppearTime = 0;
        this.m_peopleNum = 0;
        this.m_praise = 0;
        this.m_praiseExt = 0;
        this.m_orderNum = 0;
        this.m_foods = 0;
        this.m_gold = 0;
        this._maxBuyers = 4;
        this._continue = 0;
        this._continueTimes = 0;

        var year = Math.floor(this.com.saveData.month / 12) + 1;
        if (year < 10) year = "0" + year.toString();
        var mon = this.com.saveData.month % 12 == 0 ? 12 : this.com.saveData.month % 12;
        if (mon < 10 ) mon = "0" + mon.toString();
        this.m_lbMonth.string = year + "年" + mon + "月";

        this.m_lbDiamond.string = this.com.saveData.diamond;
        this.m_lbPraise.string = this.com.saveData.praise;
        this.m_lbGift.string = "";

        this.node.getChildByName("monthTarget").x = 10000;
        this.node.getChildByName("gold").x = 10000;
        this.node.getChildByName("diamond").x = 10000;

        this.m_lbGold.string = this.com.saveData.gold;

        this._people = [];

        this._monthOver = false;
        this._showMonthOver = false;
        //this.m_run = true;

        this.initUIBtn(false);
    },

    reset: function(){
        this.m_run = true;

        this.node.getChildByName("close").x = 10000;
        this.node.getChildByName("mubu").x = 10000;

        this.initDesk();

        var drinkDispenser = cc.instantiate(this.m_workbench);
        drinkDispenser.parent = this.node.getChildByName("drinkDispenser");
        drinkDispenser.getComponent('LyWorkbench').reset(this.com.saveData.shopItem["240"], this.com.saveData.shopItem["140"], false);
        drinkDispenser.setPosition(cc.p(0,0));

        var jzl = this.com.saveData.shopItem["250"];
        if (jzl){
            var dumplingDispenser = cc.instantiate(this.m_workbench);
            dumplingDispenser.parent = this.node.getChildByName("dumplingDispenser");
            dumplingDispenser.getComponent('LyWorkbench').reset(this.com.saveData.shopItem["250"], this.com.saveData.shopItem["150"], false);
            dumplingDispenser.setPosition(cc.p(0,0));
        }

        this.com.monthEvtInfo = [];
        this.m_ndMonthEvt.removeAllChildren(true);

        this.com.fluctuate = 1;
        console.log("当前波数：" + this.com.fluctuate);
        // if (this.com.saveData.month > 1){
        //     this.initMonthEvt();
        // }
        this.unlockDishes();
        
        this.m_peopleCurFlu = 0;
        this.m_peopleAppearTime = 0;
        this.m_peopleNum = 0;
        this.m_praise = 0;
        this.m_praiseExt = 0;
        this.m_orderNum = 0;
        this.m_foods = 0;
        this.m_gold = 0;
        this._maxBuyers = 4;
        this._continue = 0;
        this._continueTimes = 0;

        var year = Math.floor(this.com.saveData.month / 12) + 1;
        if (year < 10) year = "0" + year.toString();
        var mon = this.com.saveData.month % 12 == 0 ? 12 : this.com.saveData.month % 12;
        if (mon < 10 ) mon = "0" + mon.toString();
        this.m_lbMonth.string = year + "年" + mon + "月";

        this.m_lbDiamond.string = this.com.saveData.diamond;
        this.m_lbPraise.string = this.com.saveData.praise;
        this.m_lbGift.string = "<outline color=#ffffff width=4>" + this.com.saveData.gift + "</outline>";

        //this.initMonthTarget();
        this.loginShowActive();
        this.node.getChildByName("monthTarget").x = -384;
        this.node.getChildByName("gold").x = -100;
        this.node.getChildByName("diamond").x = 120;

        this.m_lbGold.string = this.com.saveData.gold;

        this._people = [];

        this._monthOver = false;
        this._showMonthOver = false;

        this.initUIBtn(true);

        this.com.setAchive(1, this.node);
    },

    initUIBtn: function(isActive){
        var dianxin = this.node.getChildByName("gift");
        dianxin.active = isActive;

        var shengjidianpu = this.node.getChildByName("btnPause");
        shengjidianpu.active = isActive;

        var shejiao = this.node.getChildByName("shejiao");
        shejiao.active = isActive;

        var chengjiu = this.node.getChildByName("chengjiu");
        chengjiu.active = isActive;

        var paihangbang = this.node.getChildByName("paihangbang");
        paihangbang.active = isActive;

        var shijie = this.node.getChildByName("shijie");
        shijie.active = isActive;

        var huodong = this.node.getChildByName("huodong");
        huodong.active = isActive;

        var mubu = this.node.getChildByName("mubu");
        if (isActive){
            mubu.x = 10000;
        }
        else{
            mubu.x = 0;
            var friendUI = cc.instantiate(this.m_friendUI);
            friendUI.parent = this.node;
            friendUI.setPosition(cc.p(0,0));
        }

        //this.initMonthEvt();
    },

    initMonthEvt: function(){
        var evtId = this.com.getMonthEvent((this.com.saveData.month % 12) + 1);
        //var evtId = 20405;
        console.log("事件ID="+evtId);
        var evtInfo = this.com.getEventInfo(evtId);
        if (evtInfo == null)
            return;

        for (var i=0; i<this.com.monthEvtInfo.length; i++){
            if (this.com.monthEvtInfo[i].id == evtId){
                if (this._randomEvtTimes && this._randomEvtTimes > 2){
                    return;
                }
                if (this._randomEvtTimes){
                    this._randomEvtTimes++;
                    this.initMonthEvt();
                } else {
                    this._randomEvtTimes = 1;
                }
                return;
            }
        }

        this._randomEvtTimes = null;
        this.com.monthEvtInfo.push(evtInfo);

        var iconItem = cc.instantiate(this.m_evtIcon);
        this.m_ndMonthEvt.addChild(iconItem);
        iconItem.getComponent('evtIconItem').init(evtId);

        var lyEvtInfo = cc.instantiate(this.m_lyEvtInfo);
        lyEvtInfo.parent = this.node;
        lyEvtInfo.setPosition(cc.p(0,0));
        lyEvtInfo.getComponent('evtTips').init(evtInfo);

        var dstPos = this.m_ndMonthEvt.convertToWorldSpaceAR(iconItem.position);
        var dstVec = this.node.convertToNodeSpaceAR(dstPos);

        this.pauseGame();

        var this_ = this;
        lyEvtInfo.runAction(cc.sequence(
            cc.delayTime(5.0),
            cc.spawn(
                cc.moveTo(1.2, dstVec),
                cc.scaleTo(1.2, 0.1)
            ),
            cc.callFunc(function(target, data){
                this_.resumeGame();
                target.removeFromParent(true);
            })
        ));
    },

    initMonthTarget: function(){
        if (this.com.saveData.month > 4){
            this._monthTarget = this.com.getMonthTarget();
        } else {
            var num = this.com.getParam(1013).param;
            if (this.com.saveData.month == 2)
                num = this.com.getParam(1014).param;
            if (this.com.saveData.month == 3)
                num = this.com.getParam(1015).param;
            if (this.com.saveData.month == 4)
                num = this.com.getParam(1016).param;

            this._monthTarget = {
                ID: 0,
                num: num
            }
        }

        this._curMonthTarget = 0;
        this._leavePeople = 0;
        this.m_lbMonthTargetV.string = "<outline color=#ffffff width=4>" + this._curMonthTarget + "/" + this._monthTarget.num + "</outline>";
        this.m_pgMonthTarget.progress = 1.0;

        var monthTargetInfo = this.com.getMTarget(this._monthTarget.ID);
        if (this._monthTarget.ID > 0){
            this.com.loadTexture(this.node, ["monthTarget","tubiao"], "png_"+monthTargetInfo.logo);

            var lyPolicy = cc.instantiate(this.m_policy);
            lyPolicy.parent = this.node;
            lyPolicy.setPosition(cc.p(0,0));
            lyPolicy.getComponent('showPolicy').init(monthTargetInfo);
            this._showMonthTargetInfo = true;

            this.pauseGame();

            var this_ = this;
            lyPolicy.runAction(cc.sequence(
                cc.delayTime(5.0),
                cc.scaleTo(1.2, 0),
                cc.callFunc(function(target, data){
                    this_._showMonthTargetInfo = null;
                    this_.resumeGame();

                    target.removeFromParent(true);
                })
            ));
        } else {
            this.com.loadTexture(this.node, ["monthTarget","tubiao"], "png_zhujiemian_fangke_tubiao");
        }
    },

    loginShowActive: function(){
        if (this.com.isLogin){
            this.com.isLogin = false;
            if (this.com.isSave && !this._getLoginAward){
                if (this.m_run) this.pauseGame();

                if (CC_WECHATGAME) wx.aldSendEvent('主页-活动', {});
                
                var wheel = cc.instantiate(this.m_wheel);
                wheel.parent = this.node;
                wheel.setPosition(cc.p(0,0));

                this._loginShowActive = true;
                this._loginShowActive1 = true;

                return;
            }
        }

        this.initMonthTarget();
    },

    initDesk: function(){
        this.initWorkbenchIcon();

        var lyDrinkDispenser = this.node.getChildByName("drinkDispenser");
        lyDrinkDispenser.removeAllChildren(true);

        var lyDumplingDispenser = this.node.getChildByName("dumplingDispenser");
        lyDumplingDispenser.removeAllChildren(true);

        this.initLayerLock("Grill", "Grill_lock1", "260");
        this.initLayerLock("Grill_long", "Grill_long_lock1", "270");
        this.initLayerLock("cabinet", "cabinet_lock1", "261");
        this.initLayerLock("cabinet_long", "cabinet_long_lock1", "271");
        this.initLayerLock("tray", "tray_lock", "240");
        this.initLayerLock("Dumplings", "Dumplings_lock", "250");

        var buyer = this.node.getChildByName("buyers");
        for (var i=0; i<this._maxBuyers; i++){
            var nd = buyer.getChildByName("node_"+i);
            if (nd) nd.removeAllChildren(true);
        }
        this.com.humanIds = [3101,3102,3201,3301];
    },

    initLayerLock: function(layer, layerLock, machineType){
        var ly = this.node.getChildByName(layer);
        var ly_lock = this.node.getChildByName(layerLock);
        for (var i=0; i<this._maxMachineNum; i++){
            var nd = ly.getChildByName("node_"+i);
            var nd_lock = ly_lock.getChildByName("node_"+i);
            if (i < this.com.getMachineLevel(machineType)){
                nd.removeAllChildren(true);

                if (nd_lock.children.length == 0){
                    var lock = cc.instantiate(this.node.getChildByName("lock"));
                    lock.name = "lock";
                    lock.parent = nd_lock;
                    lock.setPosition(cc.p(0,0));

                    this.com.loadTexture(this.node, [layerLock,"node_"+i,"lock"], "png_"+layerLock+i);
                }
            } else {
                nd_lock.removeAllChildren(true);
            }
        }
    },

    initWorkbenchIcon: function(){
        var cl = this.com.saveData.shopItem["160"];
        var cai = this.com.loadTexture(this.node, ["qianjing","160"], "png_"+cl+"_s");
        if (cl)
            cai.x = -128;
        else 
            cai.x = 10000;
        
        var yl = this.com.saveData.shopItem["170"];
        var ya = this.com.loadTexture(this.node, ["qianjing","170"], "png_"+yl+"_s");
        if (yl)
            ya.x = 64;
        else
            ya.x = 10000;

        var tl = this.com.saveData.shopItem["163"];
        var tang = this.com.loadTexture(this.node, ["qianjing","163"], "png_"+tl+"_s");
        if (tl)
            tang.x = -303;
        else 
            tang.x = 10000;

        var ll = this.com.saveData.shopItem["162"];
        var lajiao = this.com.loadTexture(this.node, ["qianjing","162"], "png_"+ll+"_s");
        if (ll)
            lajiao.x = -350;
        else
            lajiao.x = 10000;

        var cgl = this.com.saveData.shopItem["161"];
        var cong = this.com.loadTexture(this.node, ["qianjing","161"], "png_"+cgl+"_s");
        if (cgl)
            cong.x = -407;
        else
            cong.x = 10000;

        var zl = this.com.saveData.shopItem["151"];
        var zanliao = this.com.loadTexture(this.node, ["qianjing","151"], "png_"+zl+"_s");
        if (zl)
            zanliao.x = 426.6;
        else 
            zanliao.x = 10000;

        var cul = this.com.saveData.shopItem["172"];
        var chu = this.com.loadTexture(this.node, ["qianjing","172"], "png_"+cul+"_s");
        if (cul)
            chu.x = 320;
        else 
            chu.x = 10000;

        var jl = this.com.saveData.shopItem["171"];
        var jiu = this.com.loadTexture(this.node, ["qianjing","171"], "png_"+jl+"_s");
        if (jl)
            jiu.x = 266;
        else 
            jiu.x = 10000;

        var tgl = this.com.saveData.shopItem["240"];
        this.com.loadTexture(this.node, ["240"], "png_"+tgl+"_s");

        var jzl = this.com.saveData.shopItem["250"];
        if (jzl)
            this.com.loadTexture(this.node, ["250"], "png_"+jzl+"_s");

        var recycle = this.com.loadTexture(this.node, ["qianjing","recycle"], "png_lajitong");
        recycle.x = 364;
    },

    canAddTray: function(){
        var lyTrip = this.node.getChildByName("tray");
        for (var i=0; i<this.com.getMachineLevel("240"); i++){
            var node = lyTrip.getChildByName("node_"+i);
            if (!node.children.length){
                return true;
            }
        }
        return false;
    },

    addTray: function(){
        var lyTrip = this.node.getChildByName("tray");
        for (var i=0; i<this.com.getMachineLevel("240"); i++){
            var node = lyTrip.getChildByName("node_"+i);
            if (!node.children.length){
                var dishes = cc.instantiate(this.m_dishes);
                dishes.getComponent('LyDishes').init(true, this.com.saveData.shopItem["140"], 1.0);
                dishes.parent = node;
                dishes.setPosition(0,0);
            }
        }
    },

    canAddDumplings: function(){
        var lyDumplings = this.node.getChildByName("Dumplings");
        for (var i=0; i<this.com.getMachineLevel("250"); i++){
            var node = lyDumplings.getChildByName("node_"+i);
            if (!node.children.length){
                return true;
            }
        }
        return false;
    },

    addDumplings: function(){
        var lyDumplings = this.node.getChildByName("Dumplings");
        for (var i=0; i<this.com.getMachineLevel("250"); i++){
            var node = lyDumplings.getChildByName("node_"+i);
            if (!node.children.length){
                var dishes = cc.instantiate(this.m_dishes);
                dishes.getComponent('LyDishes').init(true, this.com.saveData.shopItem["150"], 1.0);
                dishes.parent = node;
                dishes.setPosition(0,0);
            }
        }
    },

    canAddBarbecue: function(isLong){
        var lyGrill = this.node.getChildByName("Grill");
        var level = this.com.getMachineLevel("260");
        if (isLong){
            lyGrill = this.node.getChildByName("Grill_long");
            level = this.com.getMachineLevel("270");
        } 
        for (var i=0; i<level; i++){
            var node = lyGrill.getChildByName("node_"+i);
            if (!node.children.length){
                return true;
            }
        }
        return false;
    },

    addBarbecue: function(machine, material, isLong){
        cc.audioEngine.playEffect(this.m_BarbecueAudio, false);
        var lyGrill = this.node.getChildByName("Grill");
        var level = this.com.getMachineLevel("260");
        if (isLong){
            lyGrill = this.node.getChildByName("Grill_long");
            level = this.com.getMachineLevel("270");
        } 
        for (var i=0; i<level; i++){
            var node = lyGrill.getChildByName("node_"+i);
            if (!node.children.length){
                var drinkDispenser = cc.instantiate(this.m_workbench);
                drinkDispenser.parent = node;
                drinkDispenser.getComponent('LyWorkbench').reset(machine, material, isLong);
                drinkDispenser.setPosition(cc.p(0,0));
                return;
            }
        }
    },

    canAddCabinet: function(isLong){
        var lyCabinet = this.node.getChildByName("cabinet");
        var level = this.com.getMachineLevel("261");
        if (isLong){
            lyCabinet = this.node.getChildByName("cabinet_long");
            level = this.com.getMachineLevel("271");
        }
        for (var i=0; i<level; i++){
            var node = lyCabinet.getChildByName("node_"+i);
            if (!node.children.length){
                return true;
            }
        }
        return false;
    },

    addCabinet: function(material, isLong){
        var lyCabinet = this.node.getChildByName("cabinet");
        var level = this.com.getMachineLevel("261");
        if (isLong){
            lyCabinet = this.node.getChildByName("cabinet_long");
            level = this.com.getMachineLevel("271");
        }
        for (var i=0; i<level; i++){
            var node = lyCabinet.getChildByName("node_"+i);
            if (!node.children.length){
                var dishes = cc.instantiate(this.m_dishes);
                dishes.getComponent('LyDishes').init(true, material, 1.0);
                dishes.parent = node;
                dishes.setPosition(0,0);
                return;
            }
        }
    },

    canCompose: function(machine, material, isLong){
        var machineType = this.com.getMachineType(machine);
        var lyCabinet = this.node.getChildByName("cabinet");
        var level = this.com.getMachineLevel(machineType.toString());
        if (isLong == 2) {
            lyCabinet = this.node.getChildByName("Dumplings");
        } else if (isLong == true){
            lyCabinet = this.node.getChildByName("cabinet_long");
        }

        for (var i=0; i<level; i++){
            var node = lyCabinet.getChildByName("node_"+i);
            if (node.children.length > 0){
                var dishes = node.children[0].getComponent('LyDishes');
                if (dishes != null){
                    var materials = dishes.m_dishes.concat();

                    var haveMaterial = false;
                    for (var h=0; h<materials.length; h++){
                        if (this.com.isSameMaterial(materials[h], material)){
                            haveMaterial = true;
                            break;
                        }
                    }
                    
                    if (!haveMaterial){
                        materials[materials.length] = material;
                        if (this.com.getFoodCompose(materials) > 0){
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    },

    compose: function(machine, material, isLong){
        var machineType = this.com.getMachineType(machine);
        var lyCabinet = this.node.getChildByName("cabinet");
        var level = this.com.getMachineLevel(machineType.toString());
        if (isLong == 2) {
            lyCabinet = this.node.getChildByName("Dumplings");
        } else if (isLong == true){
            lyCabinet = this.node.getChildByName("cabinet_long");
        }

        for (var i=0; i<level; i++){
            var node = lyCabinet.getChildByName("node_"+i);
            if (node.children.length > 0){
                var dishes = node.children[0].getComponent('LyDishes');
                if (dishes != null){
                    var materials = dishes.m_dishes.concat();

                    var haveMaterial = false;
                    for (var h=0; h<materials.length; h++){
                        if (this.com.isSameMaterial(materials[h], material)){
                            haveMaterial = true;
                            break;
                        }
                    }
                    if (!haveMaterial){
                        materials[materials.length] = material;
                        var a = this.com.getFoodCompose(materials);
                        if (a > 0){
                            dishes.addMaterial(material);
                            return;
                        }
                    }
                }
            }
        }
    },

    canAddPeople: function(){
        if (this.m_maxFluctuatePeople == 0){
            var fluct = this.com.getFluctPeople(1);
            this.m_maxFluctuatePeople = fluct.maxFluctuatePeople;
            this.m_peopleAppearBlanking = fluct.appearBlanking;
            this.m_peopleAppearTime = this.m_peopleAppearBlanking;
        }

        if (this._monthTarget && this._monthTarget.ID == 0 && this._curMonthTarget >= this._monthTarget.num){
            return false;
        }

        if (this.m_peopleCurFlu >= this.m_maxFluctuatePeople && !this._fluctuatePeopleBegin && !this._monthOver){
            return false;
        }

        var lyBuyers = this.node.getChildByName("buyers");
        for (var i=0; i<this._maxBuyers; i++){
            var node = lyBuyers.getChildByName("node_"+i);
            if (!node.children.length){
                return true;
            }
        }
        return false;
    },

    addPeople: function(){
        this.m_peopleNum++;

        var lyBuyers = this.node.getChildByName("buyers");
        var ids = [];
        for (var i=0; i<this._maxBuyers; i++){
            var node = lyBuyers.getChildByName("node_"+i);
            if (!node.children.length){
                ids[ids.length] = i;
            }
        }

        var id = Math.floor(cc.random0To1()*ids.length);
        if (this.com.saveData.month == 1 && this.m_peopleNum == 1){
            id = 2;
        }
        //console.log("id="+ids[id]);
        this._people[this._people.length] = ids[id];

        var node = lyBuyers.getChildByName("node_"+ids[id]);
        var customer = cc.instantiate(this.m_customer);
        customer.parent = node;
        customer.getComponent('LyCustomer').init(ids[id]);

        var oldChar = customer.getChildByName("character").children[0];
        var char = cc.instantiate(oldChar);
        var bg = lyBuyers.getChildByName("bg");
        char.parent = bg;

        var left = cc.random0To1() > 0.5;
        let winSize = cc.view.getDesignResolutionSize();
        let left_x = -winSize.width;
        if (!left){
            left_x = winSize.width;
        }
        char.setPosition(cc.p(left_x, 0));//-200

        if (this._monthTarget.ID == 0){
            this._curMonthTarget++;
        }

        var self = this;
        char.runAction(cc.spawn(
            cc.sequence(
                cc.moveTo(3.5, cc.p(node.x + customer.getChildByName("character").x, 0)),//-200
                cc.callFunc(function(){
                    self.m_peopleCurFlu++;

                    if (self._monthTarget.ID == 0){
                        self.m_lbMonthTargetV.string = "<outline color=#ffffff width=4>" + self._curMonthTarget + "/" + self._monthTarget.num + "</outline>";
                        self.m_pgMonthTarget.progress = 1.0 - self._curMonthTarget/self._monthTarget.num;
                    }

                    customer.getComponent("LyCustomer").begin();
                    
                    char.removeFromParent(true);
                })
            ),
            cc.repeat(cc.sequence(
                cc.moveBy(0.4, cc.p(0, 15)),
                cc.moveBy(0.4, cc.p(0, -15)),
            ),5)
        ));
    },

    guidePause: function(){
        if (!this.com.isSave) return;

        if (CC_WECHATGAME) wx.aldSendEvent('新手引导', {'4401': '升级提示'});

        var btnBG = this.com.loadTexture(this.node, ["btnPauseBG"], "png_zhujiemian_shengjidianpu_faguang");
        btnBG.active = true;
        btnBG.stopAllActions();
        btnBG.runAction(cc.repeatForever(cc.sequence(
            cc.fadeTo(0.5, 120),
            cc.fadeTo(0.5, 255)
        )));
    },

    guideNextMonth: function(){
        if (CC_WECHATGAME) wx.aldSendEvent('新手引导', {'4501': '下个月提示'});

        var btnBG = this.com.loadTexture(this.node, ["close","buttonBG"], "png_closed_xiageyue_faguang");
        btnBG.active = true;
        btnBG.stopAllActions();
        btnBG.runAction(cc.repeatForever(cc.sequence(
            cc.fadeTo(0.5, 120),
            cc.fadeTo(0.5, 255)
        )));
    },

    canSellout: function(dishes){
        var lyBuyers = this.node.getChildByName("buyers");
        for (var i=0; i<this._people.length; i++){
            var node = lyBuyers.getChildByName("node_"+this._people[i]);
            if (node.children.length > 0){
                var customer = node.children[0].getComponent("LyCustomer");
                for (var j=0; j<customer.m_requirement.length; j++){
                    if (dishes == customer.m_requirement[j]){
                        return this._people[i];
                    }
                }
            }
        }
        return -1;
    },

    sellout: function(dishes, customerId, posWorld, gold){
        var lyBuyers = this.node.getChildByName("buyers");
        var node = lyBuyers.getChildByName("node_"+customerId);
        if (node.children.length > 0){
            var customer = node.children[0].getComponent("LyCustomer");
            for (var i=0; i<customer.m_scrollContent.children.length; i++){
                var ndFood = customer.m_scrollContent.children[i];
                var food = ndFood.getComponent("LyDishes");
                if (food.m_dishes[0] == dishes){
                    //连续上菜加金币
                    var now = Date.now() / 1000;
                    if (this._continue > 0 && now - this._continue < this.com.getParam(1009).param){
                        customer.m_money += this.com.getParam(1010).param;
                        this._continueTimes++;

                        var tips = this.node.getChildByName("tips_bg");
                        var lbTip = tips.getChildByName("tips").getComponent(cc.RichText);
                        lbTip.string = "<color=#ffe050><b>" + (this._continueTimes+1).toString() + "连上菜</b></color>";
                        tips.x = 0;
                        tips.opacity = 0;
                        tips.runAction(cc.sequence(
                            cc.fadeIn(0.5),
                            cc.delayTime(1.0),
                            cc.callFunc(function(target, data){
                                target.x = 10000;
                            })
                        ));
                    } else {
                        this._continueTimes = 0;
                    }
                    this._continue = now;

                    var lyAnimate = this.node.getChildByName("animate");

                    var newNode = cc.instantiate(food.node.getChildByName("item"));
                    newNode.parent = lyAnimate;
                    
                    var srcVec2 = lyAnimate.convertToNodeSpaceAR(posWorld);
                    newNode.setPosition(srcVec2);

                    var dstWorld = food.node.convertToWorldSpaceAR(food.node.getChildByName("item").position);
                    var dstVec2 = lyAnimate.convertToNodeSpaceAR(dstWorld);

                    var animationTime = 0.2;

                    for (var j=0; j<customer.m_requirement.length; j++){
                        if (dishes == customer.m_requirement[j] && customer._totalWaitTime - customer._waitTime > 3*animationTime*60){
                            customer.m_requirement.splice(j,1);
                            break;
                        }
                    }

                    customer.m_money += gold;
                    
                    this.m_foods++;
                    this.com.setAchive(10, this.node);

                    var evt_11 = this.com.getMonthEvtByType(11);
                    for(var ii in evt_11) { 
                        if (cc.random0To1()*100 <= evt_11[ii].eventPer && this.m_foods % evt_11[ii].eventNum == 0){
                            this.m_praiseExt++;
                            this.givePraise(customerId, 1);
                        }
                    }
                    var evt_12 = this.com.getMonthEvtByType(12);
                    for(var ii in evt_12) { 
                        if (cc.random0To1()*100 <= evt_12[ii].eventPer && dishes == 11101){
                            this.m_praiseExt++;
                            this.givePraise(customerId, 1);
                        }
                    }
                    var evt_13 = this.com.getMonthEvtByType(13);
                    for(var ii in evt_13) { 
                        if (cc.random0To1()*100 <= evt_13[ii].eventPer && this.m_foods % evt_13[ii].eventNum == 0){
                            //this.m_maxFluctuatePeople++;
                            this.givePeople(customerId, 1);
                        }
                    }
                    var evt_14 = this.com.getMonthEvtByType(14);
                    for(var ii in evt_14) { 
                        if (cc.random0To1()*100 <= evt_14[ii].eventPer && dishes != 11101){
                            customer.m_money += evt_14[ii].eventNum;
                        }
                    }

                    if (customer.m_requirement.length == 0){
                        customer.m_run = false;
                        // setTimeout(function(){
                        //     customer.m_run = true
                        // }, 750)
                        customer.m_spSkeleton.getComponent(sp.Skeleton).animation = "dagaoxin";
                        this.m_orderNum++;
                        this.com.setAchive(9, this.node);

                        var feePer = this.com.getParam(1006).param;

                        var evt_7 = this.com.getMonthEvtByType(7);
                        for(var ii in evt_7) { 
                            if (cc.random0To1()*100 <= evt_7[ii].eventPer){
                                this.m_feeGold += evt_7[ii].eventNum;
                            }
                        }

                        var progress = customer._waitTime / customer._totalWaitTime;
                        if (progress >= customer.m_waitTimePer){
                            customer._behaviour = "normal";
                        } else {
                            customer._behaviour = "happy";
                        }

                        if (customer._behaviour == "happy" && cc.random0To1() < feePer){
                            var per = this.com.getParam(1005).param;

                            var evt_4 = this.com.getMonthEvtByType(4);
                            for(var ii in evt_4) { 
                                if (cc.random0To1()*100 <= evt_4[ii].eventPer){
                                    per = per * (1 + evt_4[ii].eventNum);
                                }
                            }
                            var evt_6 = this.com.getMonthEvtByType(6);
                            for(var ii in evt_6) { 
                                if (cc.random0To1()*100 <= evt_6[ii].eventPer){
                                    // this.com.setComData("diamond", this.com.saveData.diamond + evt_6[ii].eventNum);
                                    this.giveDiamond(evt_6[ii].eventNum, customerId);
                                }
                            }

                            var humanType = this.com.getHumanInfo(customer._humanId).type;
                            
                            var evt_8 = this.com.getMonthEvtByType(8);
                            for(var ii in evt_8) { 
                                if (cc.random0To1()*100 <= evt_8[ii].eventPer && humanType == 2){
                                    // this.com.setComData("diamond", this.com.saveData.diamond + evt_8[ii].eventNum);
                                    this.giveDiamond(evt_8[ii].eventNum, customerId);
                                }
                            }
                            var evt_9 = this.com.getMonthEvtByType(9);
                            for(var ii in evt_9) { 
                                if (cc.random0To1()*100 <= evt_9[ii].eventPer && humanType == 3){
                                    // this.com.setComData("diamond", this.com.saveData.diamond + evt_9[ii].eventNum);
                                    this.giveDiamond(evt_9[ii].eventNum, customerId);
                                }
                            }

                            this.m_feeGold += Math.floor(customer.m_money * per);
                            customer.m_money = Math.floor(customer.m_money * (1 + per));
                            cc.audioEngine.playEffect(this.m_reciveFeeAudio, false);
                        }
                        var evt_15 = this.com.getMonthEvtByType(15);
                        for(var ii in evt_15) { 
                            if (cc.random0To1()*100 <= evt_15[ii].eventPer){
                                customer.m_money += evt_15[ii].eventNum;
                                cc.audioEngine.playEffect(this.m_reciveFeeAudio, false);
                            }
                        }
                    } else {
                        customer.m_run = false;
                        setTimeout(function(){
                            customer.m_run = true
                        }, 750)
                        customer.m_spSkeleton.getComponent(sp.Skeleton).animation = "gaoxin";
                        var t = customer._waitTime - Math.ceil(customer._totalWaitTime * this.com.getParam(1007).param);
                        customer._waitTime = t > 0 ? t : 0;
                    }

                    var self = this;
                    newNode.runAction(cc.sequence(
                        cc.moveTo(animationTime, dstVec2),
                        cc.callFunc(function(target, data){
                            if (ndFood){
                                ndFood.removeFromParent(true);
                                target.removeFromParent(true);

                                if (customer.m_requirement.length == 0){
                                    self.giveMoney(customer.m_money, customerId);
                                }

                                customer.node.runAction(cc.sequence(
                                    cc.delayTime(0.75),
                                    cc.callFunc(function(){
                                        customer.removeFood();
                                    })
                                ));
                            }
                        })
                    ));
                    return;
                }
            }
        }
    },

    giveMoney: function(gold, customerId){
        var num = Math.ceil(gold/10);
        for (var i=0; i<num; i++){
            var spGold = cc.instantiate(this.node.getChildByName("gold1"));

            var lyBuyers = this.node.getChildByName("buyers");
            var lyAnimate = this.node.getChildByName("animate");
            spGold.parent = lyAnimate;

            var ndCustomer = lyBuyers.getChildByName("node_"+customerId);

            var srcWorld = lyBuyers.convertToWorldSpaceAR(ndCustomer.position);
            var srcVec2 = lyAnimate.convertToNodeSpaceAR(srcWorld);
            spGold.setPosition(srcVec2);

            var dstWorld = this.m_lbGold.node.parent.convertToWorldSpaceAR(this.m_lbGold.node.position);
            var dstVec2 = lyAnimate.convertToNodeSpaceAR(dstWorld);

            var self = this;
            spGold.runAction(cc.sequence(
                cc.delayTime(1.0 + i*0.2),
                cc.spawn(
                    cc.moveTo(0.5, dstVec2),
                    cc.rotateTo(0.5, 180)
                ),
                cc.callFunc(function(target, data){
                    var gold_ = gold >= 10 ? 10 : gold;
                    self.com.setComData("gold", self.com.saveData.gold + gold_);
                    self.m_gold += gold;
                    cc.audioEngine.playEffect(self.m_reciveGoldAudio, false);

                    gold -= 10;
                    self.m_lbGold.string = self.com.saveData.gold;

                    if (self._monthTarget.ID == 2){
                        self.reachGoal(gold);
                    }

                    target.removeFromParent(true);
                })
            ));
        }
    },

    giveDiamond: function(diamond, customerId){
        var spDiamond = cc.instantiate(this.node.getChildByName("diamond1"));

        var lyBuyers = this.node.getChildByName("buyers");
        var lyAnimate = this.node.getChildByName("animate");
        spDiamond.parent = lyAnimate;

        var ndCustomer = lyBuyers.getChildByName("node_"+customerId);

        var srcWorld = lyBuyers.convertToWorldSpaceAR(ndCustomer.position);
        var srcVec2 = lyAnimate.convertToNodeSpaceAR(srcWorld);
        spDiamond.setPosition(srcVec2);

        var dstWorld = this.m_lbDiamond.node.parent.convertToWorldSpaceAR(this.m_lbDiamond.node.position);
        var dstVec2 = lyAnimate.convertToNodeSpaceAR(dstWorld);

        var self = this;
        spDiamond.runAction(cc.sequence(
            cc.delayTime(1.0),
            cc.moveTo(0.5, dstVec2),
            cc.callFunc(function(target, data){
                self.com.setComData("diamond", self.com.saveData.diamond + diamond);

                cc.audioEngine.playEffect(self.m_reciveGoldAudio, false);

                self.m_lbDiamond.string = self.com.saveData.diamond;

                target.removeFromParent(true);
            })
        ));
    },

    givePraise: function(customerId, num){
        var spPraise = cc.instantiate(this.node.getChildByName("praise1"));

        var numRt = spPraise.getChildByName("num").getComponent(cc.RichText);
        numRt.string = "<outline color=#e08f4c width=2>好评+" + num + "</outline>";

        var lyBuyers = this.node.getChildByName("buyers");
        var lyAnimate = this.node.getChildByName("animate");
        spPraise.parent = lyAnimate;

        var ndCustomer = lyBuyers.getChildByName("node_"+customerId);

        var srcWorld = lyBuyers.convertToWorldSpaceAR(ndCustomer.position);
        var srcVec2 = lyAnimate.convertToNodeSpaceAR(srcWorld);
        srcVec2.y += 120;
        spPraise.setPosition(srcVec2);

        var self = this;
        spPraise.runAction(cc.sequence(
            cc.delayTime(1.0),
            cc.spawn(
                cc.moveBy(0.2, cc.p(0, 10)),
                cc.fadeOut(0.2)
            ),
            cc.callFunc(function(target, data){
                self.com.setComData("praise", self.com.saveData.praise + 1);

                cc.audioEngine.playEffect(self.m_reciveGoldAudio, false);

                self.m_lbPraise.string = self.com.saveData.praise;

                target.removeFromParent(true);
            })
        ));
    },

    givePeople: function(customerId, num){
        var spPraise = cc.instantiate(this.node.getChildByName("people1"));

        var numRt = spPraise.getChildByName("num").getComponent(cc.RichText);
        numRt.string = "<outline color=#e08f4c width=2>顾客+" + num + "</outline>";

        var lyBuyers = this.node.getChildByName("buyers");
        var lyAnimate = this.node.getChildByName("animate");
        spPraise.parent = lyAnimate;

        var ndCustomer = lyBuyers.getChildByName("node_"+customerId);

        var srcWorld = lyBuyers.convertToWorldSpaceAR(ndCustomer.position);
        var srcVec2 = lyAnimate.convertToNodeSpaceAR(srcWorld);
        srcVec2.y += 120;
        spPraise.setPosition(srcVec2);

        var self = this;
        spPraise.runAction(cc.sequence(
            cc.delayTime(1.3),
            cc.spawn(
                cc.moveBy(0.2, cc.p(0, 10)),
                cc.fadeOut(0.2)
            ),
            cc.callFunc(function(target, data){
                self._monthTarget.num++;

                cc.audioEngine.playEffect(self.m_reciveGoldAudio, false);

                self.m_lbMonthTargetV.string = "<outline color=#ffffff width=4>" + self._curMonthTarget + "/" + self._monthTarget.num + "</outline>";

                target.removeFromParent(true);
            })
        ));
    },

    unlockDishes: function(){
        for (var i=0; i<this.com.cfgFood.length; i++){
            var food = this.com.cfgFood[i];
            if (food.unlock == this.com.fluctuate && food.unlockmonth == (this.com.saveData.month - this.com.saveData.startMonth[0] + 201)){
                var find = false;
                for (var j=0; j<this.com.saveData.foods.length; j++){
                    if (this.com.saveData.foods[j] == food.id){
                        find = true;
                        break;
                    }
                }
                if (!find){
                    var foods_ = this.com.copyJsonObj(this.com.saveData.foods);
                    foods_[foods_.length] = food.id;
                    this.com.setComData("foods", foods_);
                    var show_dlg_array = []
                    for (var j=1; j<5; j++){
                        var shopItem = this.com.copyJsonObj(this.com.saveData.shopItem);
                        if (food["food"+j] == 150 && shopItem["150"] == null){
                            shopItem["150"] = 1501;
                            show_dlg_array.push(1501);
                        }
                        if (food["food"+j] == 151 && shopItem["151"] == null){
                            shopItem["151"] = 1511;
                            show_dlg_array.push(1511);
                        }
                        if (food["food"+j] == 162 && shopItem["162"] == null){
                            shopItem["162"] = 1621;
                            show_dlg_array.push(1621);
                        }
                        if (food["food"+j] == 163 && shopItem["163"] == null){
                            shopItem["163"] = 1631;
                            show_dlg_array.push(1631);
                        }
                        if (food["food"+j] == 170 && shopItem["170"] == null){
                            shopItem["170"] = 1701;
                            show_dlg_array.push(1701);
                        }
                        if (food["food"+j] == 171 && shopItem["171"] == null){
                            shopItem["171"] = 1711;
                            show_dlg_array.push(1711);
                        }
                        if (food["food"+j] == 172 && shopItem["172"] == null){
                            shopItem["172"] = 1721;
                            show_dlg_array.push(1721);
                        }

                        if (food["food"+j] == 150 && shopItem["250"] == null){
                            shopItem["250"] = 2501;
                            
                            var dumplingDispenser = cc.instantiate(this.m_workbench);
                            dumplingDispenser.parent = this.node.getChildByName("dumplingDispenser");
                            dumplingDispenser.getComponent('LyWorkbench').reset(shopItem["250"], shopItem["150"], false);
                            dumplingDispenser.setPosition(cc.p(0,0));
                        }
                        if (food["food"+j] == 150 && shopItem["251"] == null){
                            shopItem["251"] = 2511;
                        }

                        this.com.setComData("shopItem", shopItem);

                        if (food["food"+j] == 170 && shopItem["270"] == null){
                            shopItem["270"] = 2701;
                            this.upgradeUnLock("Grill_long_lock1", "270");
                        }
                        if (food["food"+j] == 170 && shopItem["271"] == null){
                            shopItem["271"] = 2711;
                            this.upgradeUnLock("cabinet_long_lock1", "271");
                        }
                        
                        this.initWorkbenchIcon();
                    }

                    if (show_dlg_array.length > 0){
                        this.pauseGame();

                        var evt = new cc.Event.EventCustom("show_dlg", true);
                        evt.setUserData({
                            show_dlg_array: show_dlg_array,
                            unlockAD: food.unlockAD,
                            key: 0
                        });
                        this.node.dispatchEvent(evt);
                    }
                }
            }
        }
    },

    show_dlg(event){
        var param = event.getUserData();
        var show_dlg_array = param.show_dlg_array;
        var key = param.key;
        var unlockAD = param.unlockAD;
        var itemInfo = cc.instantiate(this.m_dlg);
        itemInfo.parent = this.node;
        itemInfo.getComponent("dlg").init(show_dlg_array, key, unlockAD);
    },
    
    reachGoal: function(val){
        this._curMonthTarget += val;
        this.m_lbMonthTargetV.string = "<outline color=#ffffff width=4>" + this._curMonthTarget + "/" + this._monthTarget.num + "</outline>";
        this.m_pgMonthTarget.progress = 1.0 - this._curMonthTarget/this._monthTarget.num;
        if (this._curMonthTarget == this._monthTarget.num){
            this._monthOver = true;
        }
    },

    showMonthOver: function(){
        this.m_run = false;
        if (this._showMonthOver) return;

        if (this.com.isSave){
            var data = {
                peopleNum: this.m_peopleNum,
                praisePeople: this.m_praise,
                praise: this.m_praise + this.m_praiseExt,
                orderNum: this.m_orderNum,
                foods: this.m_foods,
                feeGold: this.m_feeGold,
                wasteFoods: this.m_wasteFoods,
                gold: this.m_gold,
            }
    
            var monthover = cc.instantiate(this.m_monthover);
            monthover.parent = this.node;
            monthover.getComponent('LyMonthOver').init(data);
            monthover.setPosition(cc.p(0,0));
            this._showMonthOver = true;

            var aldStr = '第' + (this.com.saveData.month + 1).toString() + '月';
            if (CC_WECHATGAME) wx.aldSendEvent('开始下个月', {aldStr: this.com.saveData.month + 1});

            this.com.saveData.month++;
            console.log("月="+this.com.saveData.month);
            this.com.setComData("month", this.com.saveData.month);
        } else {
            var data = {
                gold: this.m_lbGold.string,
                diamond: this.m_lbDiamond.string,
                praise: this.m_lbPraise.string
            }

            var friendOver = cc.instantiate(this.m_friendOver);
            friendOver.parent = this.node;
            friendOver.getComponent('LyFriendOver').init(data);
            friendOver.setPosition(cc.p(0,0));
        }

        this.initDesk();
    },

    pauseGame: function(){
        if (this.button) this.button.hide();

        var lyBuyers = this.node.getChildByName("buyers");
        for (var i=0; i<this._maxBuyers; i++){
            var nd = lyBuyers.getChildByName("node_"+i);
            if (nd.children[0]){
                nd.children[0].getComponent("LyCustomer").m_run = false;
            }
        }

        var lyGrill = this.node.getChildByName("Grill");
        for (var i=0; i<this.com.getMachineLevel("260"); i++){
            var nd = lyGrill.getChildByName("node_"+i);
            if (nd.children[0]){
                nd.children[0].getComponent("LyWorkbench").m_run = false;
            }
        }

        var lyGrill_long = this.node.getChildByName("Grill_long");
        for (var i=0; i<this.com.getMachineLevel("270"); i++){
            var nd = lyGrill_long.getChildByName("node_"+i);
            if (nd.children[0]){
                nd.children[0].getComponent("LyWorkbench").m_run = false;
            }
        }

        var lyDrinkDispenser = this.node.getChildByName("drinkDispenser");
        if (lyDrinkDispenser.children.length > 0){
            lyDrinkDispenser.children[0].getComponent("LyWorkbench").m_run = false;
        }

        var lyDumplingDispenser = this.node.getChildByName("dumplingDispenser");
        if (lyDumplingDispenser.children.length > 0){
            lyDumplingDispenser.children[0].getComponent("LyWorkbench").m_run = false;
        }

        var lyAnimate = this.node.getChildByName("animate");
        for(var i=0; i<lyAnimate.children.length; i++){
            lyAnimate.children[i].pauseAllActions();
        }

        var lyChar = this.node.getChildByName("buyers").getChildByName("bg");
        for(var i=0; i<lyChar.children.length; i++){
            lyChar.children[i].pauseAllActions();
        }

        this.m_run = false;
    },

    resumeGame: function(){
        if (this.button) this.button.show();

        var lyBuyers = this.node.getChildByName("buyers");
        for (var i=0; i<this._maxBuyers; i++){
            var nd = lyBuyers.getChildByName("node_"+i);
            if (nd.children[0]){
                nd.children[0].getComponent("LyCustomer").m_run = true;
            }
        }

        var lyGrill = this.node.getChildByName("Grill");
        for (var i=0; i<this.com.getMachineLevel("260"); i++){
            var nd = lyGrill.getChildByName("node_"+i);
            if (nd.children[0]){
                nd.children[0].getComponent("LyWorkbench").m_run = true;
            }
        }

        var lyGrill_long = this.node.getChildByName("Grill_long");
        for (var i=0; i<this.com.getMachineLevel("270"); i++){
            var nd = lyGrill_long.getChildByName("node_"+i);
            if (nd.children[0]){
                nd.children[0].getComponent("LyWorkbench").m_run = true;
            }
        }

        var lyDrinkDispenser = this.node.getChildByName("drinkDispenser");
        if (lyDrinkDispenser.children.length > 0){
            lyDrinkDispenser.children[0].getComponent("LyWorkbench").m_run = true;
        }

        var lyDumplingDispenser = this.node.getChildByName("dumplingDispenser");
        if (lyDumplingDispenser.children.length > 0){
            lyDumplingDispenser.children[0].getComponent("LyWorkbench").m_run = true;
        }

        var lyAnimate = this.node.getChildByName("animate");
        for(var i=0; i<lyAnimate.children.length; i++){
            lyAnimate.children[i].resumeAllActions();
        }

        var lyChar = this.node.getChildByName("buyers").getChildByName("bg");
        for(var i=0; i<lyChar.children.length; i++){
            lyChar.children[i].resumeAllActions();
        }

        this.m_run = true;
    },

    BtnMeat: function(event, coustEvent){
        if (this.canAddBarbecue(false)){
            this.addBarbecue(this.com.saveData.shopItem["260"], this.com.saveData.shopItem["160"], false);
        }
    },

    BtnSausage: function(event, coustEvent){
        if (this.canAddBarbecue(true)){
            this.addBarbecue(this.com.saveData.shopItem["270"], this.com.saveData.shopItem["170"], true);
        }
    },

    BtnBread: function(event, coustEvent){
        if (this.canCompose(this.com.saveData.shopItem["261"], this.com.saveData.shopItem["161"], false)){
            this.compose(this.com.saveData.shopItem["261"], this.com.saveData.shopItem["161"], false);
        }
    },

    BtnLettuce: function(event, coustEvent){
        if (this.canCompose(this.com.saveData.shopItem["261"], this.com.saveData.shopItem["162"], false)){
            this.compose(this.com.saveData.shopItem["261"], this.com.saveData.shopItem["162"], false);
        }
    },

    BtnLettuce1: function(event, coustEvent){
        if (this.canCompose(this.com.saveData.shopItem["261"], this.com.saveData.shopItem["163"], false)){
            this.compose(this.com.saveData.shopItem["261"], this.com.saveData.shopItem["163"], false);
        }
    },

    BtnStreusel: function(event, coustEvent){
        if (this.canCompose(this.com.saveData.shopItem["271"], this.com.saveData.shopItem["171"], true)){
            this.compose(this.com.saveData.shopItem["271"], this.com.saveData.shopItem["171"], true);
        }
    },

    BtnJam: function(event, coustEvent){
        if (this.canCompose(this.com.saveData.shopItem["271"], this.com.saveData.shopItem["172"], true)){
            this.compose(this.com.saveData.shopItem["271"], this.com.saveData.shopItem["172"], true);
        }
    },

    BtnDumpling: function(event, coustEvent){
        if (this.canCompose(this.com.saveData.shopItem["251"], this.com.saveData.shopItem["151"], 2)){
            this.compose(this.com.saveData.shopItem["251"], this.com.saveData.shopItem["151"], 2);
        }
    },

    BtnGift: function(event, coustEvent){
        if (!this.com.saveData.gift) return;

        var lyBuyers = this.node.getChildByName("buyers");
        var progress = 1;
        var costomerId = -1;
        for (var i=0; i<this._maxBuyers; i++){
            var node = lyBuyers.getChildByName("node_"+i);
            if (node.children.length > 0){
                var script = node.children[0].getComponent("LyCustomer");
                if (script){
                    var nd_progress = script.m_progress.getComponent(cc.ProgressBar).progress;
                    if (nd_progress < progress){
                        progress = nd_progress;
                        costomerId = i;
                    }
                }
            }
        }
        if (costomerId >= 0 && progress > 0)
        {
            if (CC_WECHATGAME) wx.aldSendEvent('主页-免费甜点', {});

            var node = lyBuyers.getChildByName("node_"+costomerId);
            var script = node.children[0].getComponent("LyCustomer");

            var t = script._waitTime - Math.ceil(script._totalWaitTime * this.com.getParam(1003).param);
            script._waitTime = t > 0 ? t : 0;

            this.com.saveData.gift--;
            this.com.setComData("gift", this.com.saveData.gift);

            this.m_lbGift.string = "<outline color=#ffffff width=4>" + this.com.saveData.gift + "</outline>";
        }
    },

    BtnPause: function(event, coustEvent){
        this.pauseGame();

        if (CC_WECHATGAME) wx.aldSendEvent('主页-升级店铺', {});

        var updateShop = cc.instantiate(this.m_updateShop);
        updateShop.parent = this.node;
        updateShop.getComponent('LyUpdateShop').init();
        updateShop.setPosition(cc.p(0,0));

        var btnPauseBG = this.node.getChildByName("btnPauseBG");
        btnPauseBG.active = false;

        if (this.com.saveData.month == 1 && this.com.saveData.newbie == 4202 && this.com.isSave){
            this.com.showGuide(this.com.saveData.newbie+1, this.node, this.m_newbie);
        }
    },

    BtnStartMonth: function(event, coustEvent){
        var btnBG = this.node.getChildByName("close").getChildByName("buttonBG");
        btnBG.active = false;

        this._taskInfo = null;

        this.reset();
    },

    BtnActive: function(event, coustEvent){
        this.pauseGame();

        if (CC_WECHATGAME) wx.aldSendEvent('主页-活动', {});

        var wheel = cc.instantiate(this.m_wheel);
        wheel.parent = this.node;
        wheel.setPosition(cc.p(0,0));
    },

    BtnWorld: function(event, coustEvent){
        if (CC_WECHATGAME) wx.aldSendEvent('主页-世界', {});

        var this_ = this;
        var httpUtils = require("httpUtils");
        var usrId = cc.sys.localStorage.getItem("usrId");
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

            if (this_.button) this_.button.destroy();

            cc.director.loadScene("MainUI");
        }, token);
    },

    BtnAchivement: function(event, coustEvent){
        if (CC_WECHATGAME) wx.showLoading({});
        
        this.pauseGame();

        if (CC_WECHATGAME) wx.aldSendEvent('主页-成就', {});

        var lyAchivement = cc.instantiate(this.m_achivement);
        lyAchivement.parent = this.node;
        lyAchivement.setPosition(cc.p(0,0));
    },

    BtnGam: function(event, coustEvent){
        this.pauseGame();

        if (CC_WECHATGAME) wx.aldSendEvent('主页-社交', {});

        var lyGame = cc.instantiate(this.m_gam);
        lyGame.parent = this.node;
        lyGame.setPosition(cc.p(0,0));
    },

    BtnRank: function(event, coustEvent){
        this.pauseGame();

        if (CC_WECHATGAME) wx.aldSendEvent('主页-排行榜', {});

        var lyRank = cc.instantiate(this.m_rank);
        lyRank.parent = this.node;
        lyRank.setPosition(cc.p(0,0));
    },

    BtnShowPolicy: function(event, coustEvent){
        if (this._showMonthTargetInfo) return;
        
        var monthTargetInfo = this.com.getMTarget(this._monthTarget.ID);
        if (this._monthTarget.ID > 0){
            var lyPolicy = cc.instantiate(this.m_policy);
            lyPolicy.parent = this.node;
            lyPolicy.setPosition(cc.p(0,0));
            lyPolicy.getComponent('showPolicy').init(monthTargetInfo);
            this._showMonthTargetInfo = true;

            this.pauseGame();

            var this_ = this;
            lyPolicy.runAction(cc.sequence(
                cc.delayTime(5.0),
                cc.scaleTo(1.2, 0),
                cc.callFunc(function(target, data){
                    this_._showMonthTargetInfo = null;
                    this_.resumeGame();
                    target.removeFromParent(true);
                })
            ));
        }
    },

    BtnTask: function(event, coustEvent){
        var taskInfo = this.com.getTask();

        var taskDes = this.node.getChildByName("close").getChildByName("richtext").getComponent(cc.RichText);

        for (var i=0; i<taskInfo.length; i++){
            var num = taskInfo[i].num;
            if (!num) num = 1
            if (this._taskInfo[i] < num){
                if (taskInfo[i].type == 1){
                    this.BtnPause();
                    break;
                } else if (taskInfo[i].type == 2){
                    this._taskInfo[i]++;
                    taskDes.string = "<b>" + taskInfo[i+1].name + "</b>";

                    if (taskInfo[i+1].type == 5){
                        this.guideNextMonth();
                    }

                    this.BtnActive();
                    break;
                } else if (taskInfo[i].type == 3){
                    this._taskInfo[i]++;
                    taskDes.string = "<b>" + taskInfo[i+1].name + "</b>";

                    if (taskInfo[i+1].type == 5){
                        this.guideNextMonth();
                    }

                    this.BtnGam();
                    break;
                } else if (taskInfo[i].type == 4){
                    this._taskInfo[i]++;
                    taskDes.string = "<b>" + taskInfo[i+1].name + "</b>";

                    if (taskInfo[i+1].type == 5){
                        this.guideNextMonth();
                    }

                    this.BtnWorld();
                    break;
                } else if (taskInfo[i].type == 5){
                    this.BtnStartMonth();
                    break;
                }
            }
        }
    },

    btnGetGold: function(event, coustEvent){
        var dlgGiveGold = cc.instantiate(this.m_dlgGiveGold);
        dlgGiveGold.parent = this.node;
    },

    customerLeave: function(event) {
        var param = event.getUserData();

        if (param.behaviour == "angry" && this._monthTarget.ID == 3){
            this.reachGoal(1);
        }
        if (param.behaviour == "happy"){
            this.m_praise++;
            this.com.setAchive(11, this.node);
            // this.com.setComData("praise", this.com.saveData.praise + 1);

            var isShowPraise = false;
            var evt_10 = this.com.getMonthEvtByType(10);
            for(var i in evt_10) { 
                if (cc.random0To1()*100 <= evt_10[i].eventPer){
                    this.m_praiseExt++;
                    // this.com.setComData("praise", this.com.saveData.praise + 1);
                    this.givePraise(param.id, 2);
                    isShowPraise = true;
                }
            }

            if (!isShowPraise){
                // if (this.m_praiseExt > 0){
                //     this.givePraise(param.id, this.m_praiseExt + 1);
                // } else {
                    this.givePraise(param.id, 1);
                // }
            }
        }
        if (param.behaviour != "happy" && this._monthTarget.ID == 4){
            this.reachGoal(1);
        }
        var rand = cc.random0To1();
        if (param.behaviour == "angry" && rand <= 0.5){
            this.m_praise = (this.m_praise - 1) > 0 ? (this.m_praise) - 1 : 0;
            var praise_ = (this.com.saveData.praise - 1) > 0 ? (this.com.saveData.praise - 1) : 0;
            this.com.setComData("praise", praise_);
            this.m_lbPraise.string = this.com.saveData.praise;
        }

        var lyBuyers = this.node.getChildByName("buyers");
        var node = lyBuyers.getChildByName("node_"+param.id);
        var oldChar = node.children[0].getChildByName("character").children[0];
        
        //behaviour: this._behaviour
        var char = cc.instantiate(oldChar);
        var bg = lyBuyers.getChildByName("bg");
        char.parent = bg;

        var newVec1 = oldChar.parent.convertToWorldSpaceAR(oldChar.position);
        var newVec2 = bg.convertToNodeSpaceAR(newVec1);
        char.setPosition(newVec2);

        var left = cc.random0To1() > 0.5;
        let winSize = cc.view.getDesignResolutionSize();
        let left_x = -winSize.width;
        if (!left){
            left_x = winSize.width;
        }

        for (var i=0; i<this._people.length; i++){
            if (this._people[i] == param.id){
                this._people.splice(i,1);
                break;
            }
        }
        node.removeAllChildren(true);

        this._leavePeople++;

        var this_ = this;
        char.runAction(cc.spawn(
            cc.sequence(
                cc.moveTo(3.5, cc.p(left_x, 0)),//-200
                cc.callFunc(function(){
                    console.log(this_._monthTarget.ID, this_._leavePeople, this_._monthTarget.num)
                    if (this_._monthTarget.ID == 0 && this_._leavePeople >= this_._monthTarget.num){
                        this_._monthOver = true;
                    }
                    if (this_.m_peopleCurFlu >= this_.m_maxFluctuatePeople && !this_._fluctuatePeopleBegin && !this_._monthOver){
                        this_._fluctuatePeopleBegin = true;
                        this_.node.runAction(cc.sequence(
                            cc.delayTime(this_.com.getParam(1017).param),
                            cc.callFunc(function(target, customData){
                                this_.com.fluctuate = this_.com.fluctuate + 1;
                                cc.audioEngine.playEffect(this_.m_FluctuateOverAudio, false);
                                console.log("当前波数：" + this_.com.fluctuate);
        
                                this_.guidePause();
        
                                if (!this_._monthOver){
                                    if (this_.com.fluctuate % 2 == 1 && this_.com.saveData.month > 1){
                                        this_.initMonthEvt();
                                    }
                                    var tips = this_.node.getChildByName("tips_bg");
                                    var lbTip = tips.getChildByName("tips").getComponent(cc.RichText);
                                    lbTip.string = "<color=#ffe050><b>一大波顾客即将到来！</b></color>";
                                    tips.x = 0;
                                    tips.opacity = 0;
                                    tips.runAction(cc.sequence(
                                        cc.fadeIn(0.5),
                                        cc.delayTime(1.0),
                                        cc.callFunc(function(target, data){
                                            target.x = 10000;
                                        })
                                    ));
                                }
        
                                this_.unlockDishes();
                                this_.m_peopleCurFlu = 0;
        
                                var fluct = this_.com.getFluctPeople(this_.com.fluctuate);
                                this_.m_maxFluctuatePeople = fluct.maxFluctuatePeople;
                                this_.m_peopleAppearBlanking = fluct.appearBlanking;
                                this_.m_peopleAppearTime = this_.m_peopleAppearBlanking;
        
                                this_._fluctuatePeopleBegin = null;
                            })
                        ))
                    }

                    char.removeFromParent(true);
                })
            ),
            cc.repeat(cc.sequence(
                cc.moveBy(0.4, cc.p(0, 15)),
                cc.moveBy(0.4, cc.p(0, -15)),
            ),5)
        ));

        //event.stopPropagation();
    },

    wasteDishes: function(event){
        if (this._monthTarget.ID == 1){
            this.reachGoal(1);
        }
    },

    showClose: function(event){
        this.node.getChildByName("close").x = 0;
        this.node.getChildByName("mubu").x = 0;

        var taskInfo = this.com.getTask();

        if (taskInfo.length > 0){
            this._taskInfo = [];
            for (var i=0; i<taskInfo.length; i++){
                this._taskInfo[i] = 0;
            }

            var ext = taskInfo[0].name;
            if (taskInfo[0].type == 1){
                ext += "（0/" + taskInfo[0].num + "）";
            }

            var taskDes = this.node.getChildByName("close").getChildByName("richtext").getComponent(cc.RichText);
            taskDes.string = "<b>" + ext + "</b>";
        } else {
            this.node.getChildByName("close").getChildByName("qianwang1").active = false;
            this.node.getChildByName("close").getChildByName("richtext").active = false;
        }

        //this.guideNextMonth();
    },

    closeShop: function(event){
        this.resumeGame();
        if (this._monthOver)
            this.m_run = false;
    },

    upgradeUnLock: function(layerLock, machineType){
        var ly_lock = this.node.getChildByName(layerLock);
        for (var i=0; i<this._maxMachineNum; i++){
            var nd_lock = ly_lock.getChildByName("node_"+i);
            if (i < this.com.getMachineLevel(machineType)){
                if (nd_lock.children.length == 0){
                    var lock = cc.instantiate(this.node.getChildByName("lock"));
                    lock.name = "lock";
                    lock.parent = nd_lock;
                    lock.setPosition(cc.p(0,0));

                    this.com.loadTexture(this.node, [layerLock,"node_"+i,"lock"], "png_"+layerLock+i);
                }
            } else {
                nd_lock.removeAllChildren(true);
            }
        }
    },

    upgradeItem: function(event){
        //var param = event.getUserData();

        this.upgradeUnLock("Grill_lock1", "260");
        this.upgradeUnLock("Grill_long_lock1", "270");
        this.upgradeUnLock("cabinet_lock1", "261");
        this.upgradeUnLock("cabinet_long_lock1", "271");

        this.m_lbGold.string = this.com.saveData.gold;
        this.initWorkbenchIcon();

        console.log(this._taskInfo)
        if (this._taskInfo){
            var taskInfo = this.com.getTask();

            var index = -1;
            for (var i=0; i<taskInfo.length; i++){
                if (taskInfo[i].type == 1){
                    index = i;
                    break;
                }
            }
            console.log(index)

            if (index >= 0 && this._taskInfo[index] != null){
                this._taskInfo[index]++;
                console.log(taskInfo[index])                

                if (this._taskInfo[index] >= taskInfo[index].num){
                    this._taskInfo[index] = taskInfo[index].num;

                    if (taskInfo[index+1]){
                        var taskDes = this.node.getChildByName("close").getChildByName("richtext").getComponent(cc.RichText);
                        taskDes.string = "<b>" + taskInfo[index+1].name + "</b>";
                        if (taskInfo[index+1].type == 5){
                            this.guideNextMonth();
                        }
                    }
                } else {
                    var ext = taskInfo[index].name + "（" + this._taskInfo[index] + "/" + taskInfo[index].num + "）";

                    var taskDes = this.node.getChildByName("close").getChildByName("richtext").getComponent(cc.RichText);
                    taskDes.string = "<b>" + ext + "</b>";
                }
            }
        }
    },

    closeActive: function(event){
        this.resumeGame();
        if (this._loginShowActive1){
            this._loginShowActive1 = null;
            this.initMonthTarget();
        } else {
            if (this._monthOver)
                this.m_run = false;
        }
    },

    refreshFluctuate: function(){
        if (this._monthOver){
            console.log("目标达成，本月结束");
            this.showMonthOver();
            return;
        }
        if (this.canAddPeople()){
            this.m_peopleAppearTime++;
            if (this.com.fluctuate == 12){
                console.log("波数用完，本月结束");
                this.showMonthOver();
                return;
            } else if (this.m_peopleAppearTime >= this.m_peopleAppearBlanking && !this._fluctuatePeopleBegin){
                this.addPeople();
                this.m_peopleAppearTime = 0;
            }
        }
    },

    showEvtInfo: function(event){
        if (this._showEvtInfo) return;

        this.pauseGame();

        var param = event.getUserData();

        var lyEvtInfo = cc.instantiate(this.m_lyEvtInfo);
        lyEvtInfo.parent = this.node;
        lyEvtInfo.setPosition(cc.p(0,0));
        lyEvtInfo.getComponent('evtTips').init(param.evtInfo);

        var this_ = this;
        lyEvtInfo.runAction(cc.sequence(
            cc.delayTime(5.0),
            cc.scaleTo(1.2, 0.1),
            cc.callFunc(function(target, data){
                this_._showEvtInfo = null;
                this_.resumeGame();
                target.removeFromParent(true);
            })
        ));

        this._showEvtInfo = true;
    },

    closeEvtInfo: function(event){
        this._showEvtInfo = null;
        this.resumeGame();
    },

    closeMonthTargetInfo: function(event){
        this._showMonthTargetInfo = null;
        this.resumeGame();
    },

    closeAchivement: function(event){
        this.resumeGame();
    },

    closeGam: function(event){
        this.resumeGame();
    },

    closeRank: function(event){
        this.resumeGame();
    },

    helpFriend: function(event){
        var drinkDispenser = this.node.getChildByName("drinkDispenser");
        drinkDispenser.children[0].getComponent('LyWorkbench').reset(this.com.saveData.shopItem["240"], this.com.saveData.shopItem["140"], false);

        var jzl = this.com.saveData.shopItem["250"];
        if (jzl){
            var dumplingDispenser = this.node.getChildByName("dumplingDispenser");
            dumplingDispenser.children[0].getComponent('LyWorkbench').reset(this.com.saveData.shopItem["250"], this.com.saveData.shopItem["150"], false);
        }

        this.node.getChildByName("mubu").x = 10000;

        this._monthTarget = {
            ID: 0,
            num: 10
        }
        this._curMonthTarget = 0;
        this._leavePeople = 0;
        this.m_lbMonthTargetV.string = "<outline color=#ffffff width=4>" + this._curMonthTarget + "/" + this._monthTarget.num + "</outline>";
        this.m_pgMonthTarget.progress = 1.0;

        this.node.getChildByName("monthTarget").x = -384;

        this.com.saveData.gold = 0;
        this.m_lbGold.string = 0;
        this.com.saveData.diamond = 0;
        this.m_lbDiamond.string = 0;
        this.com.saveData.praise = 0;
        this.m_lbPraise.string = 0;

        this.m_run = true;
    },

    upGold: function(event){
        this.m_lbGold.string = this.com.saveData.gold;
    },

    upDiamond: function(event){
        this.m_lbDiamond.string = this.com.saveData.diamond;
    },

    upGift: function(event){
        this.m_lbGift.string = "<outline color=#ffffff width=4>" + this.com.saveData.gift + "</outline>";
    },

    closeLoginAward: function(event){
        this._getLoginAward--;
        if (this._getLoginAward <= 0 && this._monthTarget){
            this.resumeGame();
        }
    },

    closeDlg: function(event){
        var tips = this.node.getChildByName("tips_bg1");
        tips.x = 0;
        tips.opacity = 0;
        tips.runAction(cc.sequence(
            cc.fadeIn(0.5),
            cc.delayTime(1.0),
            cc.callFunc(function(target, data){
                target.x = 10000;
            })
        ));

        this.resumeGame();
    },

    update (dt) {
        if (!this.m_run)
            return;

        this.refreshFluctuate();
    },
});
