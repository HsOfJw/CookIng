cc.Class({
    extends: cc.Component,

    properties: {
        m_scrollView: cc.ScrollView,
        m_scrollViewContent: cc.Node,
        btn_back: cc.Button,
        purchaseStore: cc.Prefab,
    },

    onLoad () {
        var this_ = this;
        this.com = require('common');
        this.httpUtils = require("httpUtils");

        var item = this.m_scrollViewContent.getChildByName("item");

        var daditu1 = item.getChildByName("daditu1");
        daditu1.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["jpg_daditu1"]);

        var daditu2 = item.getChildByName("daditu2");
        daditu2.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["jpg_daditu2"]);

        var kuaicandian = item.getChildByName("kuaicandian");
        kuaicandian.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_ditu_kuaicandian"]);

        var weijiesuo_1 = item.getChildByName("weijiesuo_1");
        weijiesuo_1.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_ditu_weijiesuo_1"]);

        var weijiesuo_2 = item.getChildByName("weijiesuo_2");
        weijiesuo_2.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_ditu_weijiesuo_2"]);

        var weijiesuo_3 = item.getChildByName("weijiesuo_3");
        weijiesuo_3.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_ditu_weijiesuo_3"]);

        var weijiesuo_4 = item.getChildByName("weijiesuo_4");
        weijiesuo_4.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_ditu_weijiesuo_4"]);

        var weijiesuo_5 = item.getChildByName("weijiesuo_5");
        weijiesuo_5.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_ditu_weijiesuo_5"]);

        var weijiesuo_6 = item.getChildByName("weijiesuo_6");
        weijiesuo_6.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_ditu_weijiesuo_6"]);

        var weijiesuo_7 = item.getChildByName("weijiesuo_7");
        weijiesuo_7.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_ditu_weijiesuo_7"]);

        var weijiesuo_8 = item.getChildByName("weijiesuo_8");
        weijiesuo_8.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_ditu_weijiesuo_8"]);

        this.btn_back.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shengji_fanhui"]);

        var this_ = this;
        this.m_scrollView.node.on('scrolling', function ( event ) {
            if (this_.m_scrollViewContent.x > -1560/2) this_.m_scrollViewContent.x = -1560/2;
            if (this_.m_scrollViewContent.x < -3120 + 1560/2) this_.m_scrollViewContent.x = -3120 + 1560/2;
        });

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
                                // wx.aldSendEvent('世界陆页面分享成功',{});
                            }
                            this_.com.setAchive(7, this_.node);
                        },
                        fail(res){
                            console.log("转发失败!!!")
                            if (CC_WECHATGAME) {
                                // wx.aldSendEvent('世界页面分享失败',{});
                            }
                        } 
                    }
                })
            });
        }

    },

    start () {
        var levelUp = [];
        var bool = true;        //是否已经解锁
        var bool1 = true;       //是否要解锁
        if(this.com.saveData.allStore == 2){
            bool = true;
        }else{
            bool = false;
            for(var key in this.com.saveData.shopItem){
                var id = this.com.saveData.shopItem[key];
                //第一个店商店里的ID
                if (((id >= 1101 && id <= 1325) || (id >= 2101 && id <= 2313))){
                    var gold = null;
                    var item = this.com.getMachineItemByID(id);
                    if (item){
                        gold = item.levelUp;
                    } else {
                        item = this.com.getDishesByID(id);
                        if (item){
                            gold = item.LevelUp;
                        }
                    }
                    levelUp.push(gold);
                }
            }
            for(var key in levelUp){
                if(levelUp[key] > 0){
                    bool1 = false;
                }
            }
        }

        var item_node = this.m_scrollViewContent.getChildByName("item");
        var weijiesuo_1 = item_node.getChildByName("weijiesuo_1");
        var tip = weijiesuo_1.getChildByName("tip");
        var Btn_unlock = weijiesuo_1.getChildByName("Btn_unlock");
        tip.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_pic_dialogbg"]);
        Btn_unlock.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_goumai_anniuda"]);
        weijiesuo_1.getComponent(cc.Button).interactable = false;
        if(bool == false){
            if(bool1 == true){
                tip.active = false;
                Btn_unlock.active = true;
            }
        }else{
            weijiesuo_1.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_ditu_zhongcanting"]);
            tip.active = false;
            weijiesuo_1.getComponent(cc.Button).interactable = true;
        }
    },

    btnStart: function(event, coustEvent){
        var usrId = cc.sys.localStorage.getItem("usrId");

        if (this.com.saveData.curStore && this.com.saveData.curStore != 1){
            this.com.setComData("curStore", 1);

            var this_ = this;
            var httpUtils = require("httpUtils");
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

                this_.com.initUserDataFromServer(usrId);
            }, token);
        } else {
            this.com.initUserDataFromServer(usrId);
        }
    },

    btnCooking: function(event, coustEvent){
        var usrId = cc.sys.localStorage.getItem("usrId");

        if (this.com.saveData.curStore == null || this.com.saveData.curStore != 2){
            var foods = this.com.copyJsonObj(this.com.saveData.foods);
            foods.push(11401);
            foods.push(11601);
            this.com.setComData("foods", foods);

            var shopItem = this.com.copyJsonObj(this.com.saveData.shopItem);
            shopItem["140"] = 1401;
            shopItem["240"] = 2401;
            shopItem["160"] = 1601;
            shopItem["161"] = 1611;
            shopItem["260"] = 2601;
            shopItem["261"] = 2611;
            this.com.setComData("shopItem", shopItem);

            this.com.setComData("curStore", 2);

            var startMonth = [];
            if (this.com.saveData.startMonth != null){
                startMonth = this.com.copyJsonObj(this.com.saveData.startMonth);
            }
            startMonth.push(this.com.saveData.month);
            this.com.setComData("startMonth", startMonth);

            var this_ = this;
            var httpUtils = require("httpUtils");
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

                this_.com.initUserDataFromServer(usrId);
            }, token);
        } else {
            this.com.initUserDataFromServer(usrId);
        }
    },

    btnBack(){
        if(!this.com.saveData.curStore || this.com.saveData.curStore == 1){
            this.btnStart();
        }else{
            this.btnCooking();
        }
    },

    btnUnlock(){
        var item = cc.instantiate(this.purchaseStore);
        item.parent = this.node;
    },
});
