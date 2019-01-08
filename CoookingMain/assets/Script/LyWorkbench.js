cc.Class({
    extends: cc.Component,

    properties: {
        m_bg: cc.Sprite,
        m_item: cc.Node,
        m_progress: cc.ProgressBar,
        m_spProgress: cc.Sprite,
        m_spBar: cc.Sprite,
        m_smoke: cc.ParticleSystem,
        m_machine: 0,
        m_dishes: 0,
        m_run: false,
        m_work: false,
        m_step: 0,
        m_times: 0,
        m_duration: 0,

        m_GrilledPasteAudio: {
            default: null,
            type: cc.AudioClip
        },
        m_FoodGoodAudio: {
            default: null,
            type: cc.AudioClip
        }

        // holdTimeEclipse: 0,        //用来检测长按
        // holdClick: false,          //用来检测点击
        // hold_one_click: 0,         //用来检测单击
    },

    onLoad() {
        this.com = require('common');
        this.httpUtils = require("httpUtils");

        this.m_progress.getComponent(cc.ProgressBar).progress = 0;

        var parent = this.node;
        while (parent.parent != null) {
            parent = parent.parent;
        }
        this.script_gameUI = parent.children[0].getComponent("GameUI");
        if (this.com.saveData.curStore == 2) {
            this.script_gameUI = parent.children[0].getComponent("CookingUI");
        }

        var this_ = this;

        // //touchstart   touchend
        // this.m_item.on(cc.Node.EventType.TOUCH_START, function(event){
        //     this_.holdClick = true;
        //     this_.holdTimeEclipse = 0;

        //     this_.btnClick(event);
        // },this.m_item);

        // this.m_item.on(cc.Node.EventType.TOUCH_END, function(event){           
        //     this_.holdClick=false;
        //     if(this_.holdTimeEclipse>=30)
        //     {                
        //         this_.btn_status('long', event);                
        //     }
        //     else
        //     {                
        //         this_.btn_status('short', event);            
        //     }    
        //     //开始记录时间
        //     this_.holdTimeEclipse=0; 
        // },this.m_item);

        this.m_waitTimePer = this.com.getParam(1002).param;
        this.m_redTimePer = 1 - this.com.getParam(1004).param;

        this.m_spProgress.spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_penren_jingdu"]);
        this.m_spBar.spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_penren_jingdutiao"]);
    },

    start() {
    },

    reset: function (machine, dishes, isLong) {
        var drinkanime = this.node.getChildByName("drinkanime");
        if (dishes == 1101) {
            drinkanime.active = true;
            drinkanime.getComponent(sp.Skeleton).animation = 1;
        } else if (dishes >= 1102 && dishes <= 1105) {
            drinkanime.active = true;
            drinkanime.getComponent(sp.Skeleton).animation = 2;
        } else {
            drinkanime.active = false;

            var item = this.node.getChildByName("item");
            item.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_" + dishes + "_p"]);
            //this.m_bg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_"+dishes+"_p"]);
        }

        this.m_dishes = dishes;
        this.m_machine = machine;
        this.m_run = true;
        this.m_work = true;
        this.m_bg.enabled = true;
        this.m_step = 0;
        this.m_times = 0;
        this.m_item.x = 10;
        this.m_progress.node.x = -25;
        this._isLong = isLong;
        this._machineType = this.com.getMachineType(this.m_machine);
        this._canScorch = this.com.canScorch(this.m_machine);
        if (!this._canScorch) {
            this.m_smoke.stopSystem();
        }
    },

    over: function () {
        this.m_work = false;
        this.m_bg.enabled = false;

        if (!this._canScorch && this.script_gameUI.canAddTray() && this._machineType == 210) {
            this.m_item.x = 10000;
            this.m_progress.node.x = 10000;
            this.node.getChildByName("drinkanime").active = false;
            this.script_gameUI.addTray();
            return;
        }
        if (!this._canScorch && this.com.saveData.curStore == 2 && this.script_gameUI.canAddTray() && this._machineType == 240) {
            this.m_item.x = 10000;
            this.m_progress.node.x = 10000;
            this.node.getChildByName("drinkanime").active = false;
            this.script_gameUI.addTray();
            return;
        }
        if (!this._canScorch && this.com.saveData.curStore == 2 && this.script_gameUI.canAddDumplings() && this._machineType == 250) {
            this.m_item.x = 10000;
            this.m_progress.node.x = 10000;
            this.node.getChildByName("drinkanime").active = false;
            this.script_gameUI.addDumplings();
            return;
        }

        var item = this.node.getChildByName("item");

        this.m_times++;
        if (this.m_times == 1) {
            cc.audioEngine.playEffect(this.m_FoodGoodAudio, false);

            item.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_" + this.m_dishes]);
            this.m_spProgress.spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_huo_jingdu"]);
            this.m_spBar.spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_huo_jingdutiao"]);

            // food_good

            if (this._canScorch) {
                if (this.com.saveData.month == 1 && this.com.saveData.newbie >= 4102 && this.com.saveData.newbie <= 4104) {
                    return;
                }

                this.m_work = true;
                this.m_step = 0;
                this.m_item.x = 10;
                return;
            }
        } else if (this.m_times == 2) {
            cc.audioEngine.playEffect(this.m_GrilledPasteAudio, false);

            item.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_" + this.m_dishes + "_a"]);
            this.node.dispatchEvent(new cc.Event.EventCustom("wasteDishes", true));

            this.m_smoke.stopSystem();
        }
        this.m_item.x = 10;
        this.m_progress.node.x = 10000;
    },

    evtTrigger: function () {
        var json = this.com.getDurationByID(this.m_machine);
        if (this.m_times == 0) {
            this.m_duration = json.duration * 60;

            var evt_1 = this.com.getMonthEvtByType(1);
            for (var i in evt_1) {
                if ((this._machineType == 220 || this._machineType == 230) && Math.random() * 100 <= evt_1[i].eventPer) {
                    this.m_duration += evt_1[i].eventNum * 60;
                    if (this.m_duration < 10) this.m_duration = 10;
                }
            }
        } else if (this.m_times == 1) {
            this.m_duration = json.scorch * 60;

            var evt_2 = this.com.getMonthEvtByType(2);
            for (var i in evt_2) {
                if ((this._machineType == 220 || this._machineType == 230) && Math.random() * 100 <= evt_2[i].eventPer) {
                    this.m_duration += evt_2[i].eventNum * 60;
                    if (this.m_duration < 10) this.m_duration = 10;
                }
            }
        }
    },

    btnClick: function () {
        var this_ = this;
        this.m_item.runAction(cc.sequence(
            cc.scaleTo(0.3, 1.2),
            cc.scaleTo(0.2, 0.9),
            cc.scaleTo(0.1, 1.0)
        ));

        if (this._canScorch && this.m_times == 1) {
            var mType = this.com.getMaterialsType(this.m_dishes);
            if (mType == 160 && this.script_gameUI.canAddCabinet(false)) {
                this.script_gameUI.addCabinet(this.com.saveData.shopItem["160"], false);
                this.node.removeFromParent(true);
            } else if (mType == 170 && this.script_gameUI.canAddCabinet(true)) {
                this.script_gameUI.addCabinet(this.com.saveData.shopItem["170"], true);
                this.node.removeFromParent(true);
            } else {
                //这里只是烤架类型，需要托盘类型才能获得托盘数量，所以这里写死加10
                if (this.script_gameUI.canCompose(this.m_machine + 10, this.m_dishes, this._isLong)) {
                    this.script_gameUI.compose(this.m_machine + 10, this.m_dishes, this._isLong);
                    this.node.removeFromParent(true);

                    if (this.com.saveData.month == 1 && this.com.saveData.newbie == 4104 && this.com.isSave) {
                        this.com.showGuide(this.com.saveData.newbie + 1, this.script_gameUI.node, this.script_gameUI.m_newbie);
                    }
                }
            }
        }
        // },

        // btnDoubleClick: function(event){
        //console.log("DoubleClick = " + this.m_machine + "   " + this.m_times);
        if (this._canScorch && this.m_times == 2) {
            var rect1 = this.script_gameUI.node.convertToWorldSpaceAR(this.script_gameUI.m_ndRecycle);
            var rect2 = this.node.convertToNodeSpaceAR(rect1);
            this_.m_item.runAction(cc.sequence(
                cc.moveTo(0.5, cc.v2(rect2.x, rect2.y)),
                cc.callFunc(function () {
                    this_.node.removeFromParent(true);
                })
            ));
        }
    },

    // btn_status: function(status, event){
    //     if(status == 'short')
    //     {
    //         //console.log("hold_one_click = " + this.hold_one_click)
    //         this.hold_one_click++;
    //         setTimeout(() => {
    //             if(this.hold_one_click == 1)
    //             {
    //                 //console.log('short');
    //                 this.hold_one_click = 0;
    //                 //this.btnClick(event);
    //             } 
    //             else if(this.hold_one_click >= 2)
    //             {
    //                 //console.log('double');
    //                 this.hold_one_click = 0;
    //                 this.btnDoubleClick(event);
    //             }              
    //         }, 400);

    //     }
    //     else
    //     {
    //         this.hold_one_click = 0;
    //         //console.log(status);
    //         //this.btnClick(event);
    //     }
    // },

    update(dt) {
        if (!this.m_run)
            return;

        // if(this.holdClick){
        //     this.holdTimeEclipse++;
        //     if(this.holdTimeEclipse>120)//如果长按时间大于2s，则认为长按了2s
        //     {
        //         this.holdTimeEclipse=120;
        //     }
        // }

        if (this.m_work) {
            this.evtTrigger();
            if (this.m_step < this.m_duration) {
                this.m_step++;
                var progress = this.m_step / this.m_duration;
                if (progress >= this.m_redTimePer && this.m_times == 1) {
                    this.m_spProgress.spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_huojinji_jingdu"]);
                    this.m_spBar.spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_huojinji_jingdutiao"]);
                }
                if (this.m_step >= this.m_duration) {
                    this.over();
                    return;
                }
                this.m_progress.getComponent(cc.ProgressBar).progress = this.m_step / this.m_duration;
            }
        }
        if (!this.m_work && !this._canScorch) {
            if (this.script_gameUI.canAddTray() && this._machineType == 210) {
                this.reset(this.m_machine, this.m_dishes, this._isLong);
            }
            if (this.com.saveData.curStore == 2 && this.script_gameUI.canAddTray() && this._machineType == 240) {
                this.reset(this.m_machine, this.m_dishes, this._isLong);
            }
            if (this.com.saveData.curStore == 2 && this.script_gameUI.canAddDumplings() && this._machineType == 250) {
                this.reset(this.m_machine, this.m_dishes, this._isLong);
            }
            return;
        }
    },
});
