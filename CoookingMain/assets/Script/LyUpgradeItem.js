cc.Class({
    extends: cc.Component,

    properties: {
        m_dlgGiveGold: cc.Prefab,
        m_praise: cc.Label,
        m_gold: cc.Label,
        m_diamond: cc.Label,
        m_diff: cc.Label,
        texView: cc.Sprite,//显示排行榜
        tex_bg: cc.Sprite,
        btn_back_qun_button: cc.Button,
        m_upGradeAudio: {
            default: null,
            type: cc.AudioClip
        },
    },

    onLoad () {
        this.com = require('common');
        this.httpUtils = require("httpUtils");
        this.popup = require('popup');

        this.node_anim = this.node.runAction(cc.sequence(
            cc.scaleTo(0.05, 1.1),
            cc.scaleTo(0.2, 1.0)
        ));

        this.node.on('upGold', this.upGold, this);
        this.node.on('upDiamond', this.upDiamond, this);

        this.com.loadTexture(this.node, ["btnReturn"], "png_shengji_fanhui");

        this.btn_back_qun_button.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shengji_fanhui"]);

        this.com.loadTexture(this.node, ["groupRank"], "png_qunpaihang");
        this.com.loadTexture(this.node, ["aixin"], "png_zhujiemian_aixin");
        this.com.loadTexture(this.node, ["jinbi"], "png_zhujiemian_jinbi");
        this.com.loadTexture(this.node, ["button"], "png_zhujiemian_jia");
        this.com.loadTexture(this.node, ["zuanshi"], "png_zhujiemian_zuanshi");
        this.com.loadTexture(this.node, ["button1"], "png_zhujiemian_jia");
        this.com.loadTexture(this.node, ["left","bg"], "png_shengji_ditu");
        this.com.loadTexture(this.node, ["right","bg"], "png_shengji_ditu");
        this.com.loadTexture(this.node, ["shengji_jiantou"], "png_shengji_jiantou");
        this.com.loadTexture(this.node, ["shengji_jinbi"], "png_shengji_jinbi");
        this.com.loadTexture(this.node, ["upgrade"], "png_shengji_anniu");

        if(CC_WECHATGAME){
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 1560;
            window.sharedCanvas.height = 720;
        }
    },

    start () {
    },

    init: function(itemId){
        this._itemId = itemId;

        var des = null;
        var des_next = null;
        var gold = null;
        var duration = null;
        var gold_next = null;
        var duration_next = null;
        var levelUp = 0;

        var item = this.com.getMachineItemByID(itemId);
        if (item != null){
            des = item.des;
            gold = "数量:"+item.num;
            if (item.duration) duration = item.duration+"秒";
            levelUp = item.levelUp;
            
            var item_next = this.com.getMachineItemByID(itemId + 1);
            if (item_next){
                des_next = item_next.des;
                gold_next = "数量:"+item_next.num;
                if (item_next.duration) duration_next = item_next.duration+"秒";
            }
        }
        if (gold_next == null){
            item = this.com.getDishesByID(itemId);
            if (item != null){
                des = item.des;
                gold = "价格:"+item.price;
                levelUp = item.LevelUp;

                var item_next = this.com.getDishesByID(itemId + 1);
                if (item_next){
                    des_next = item_next.des;
                    gold_next = "价格:"+item_next.price;
                }
            }
        }

        if (gold_next && des_next){
            var left = this.node.getChildByName("left");
            var name_left = left.getChildByName("name");
            name_left.getComponent(cc.Label).string = item.name;
            var spItem_left = left.getChildByName("spItem");
            spItem_left.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_" + itemId + "_s"]);
            var desc_left = left.getChildByName("desc");
            this.showDesc(desc_left.getComponent(cc.Label), des);
            var gold_left = left.getChildByName("gold");
            var num_left = left.getChildByName("num");
            if (duration){
                gold_left.getComponent(cc.Label).string = gold ;
                num_left.active = true;
                num_left.getComponent(cc.Label).string = duration;
            } else {
                gold_left.getComponent(cc.Label).string = gold;
                num_left.active = false;
            }

            var right = this.node.getChildByName("right");
            var name_right = right.getChildByName("name");
            name_right.getComponent(cc.Label).string =  item_next.name ;
            var spItem_right = right.getChildByName("spItem");
            spItem_right.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_" + (itemId + 1).toString() + "_s"]);
            var desc_right = right.getChildByName("desc");
            this.showDesc(desc_right.getComponent(cc.Label), des_next);
            var gold_right = right.getChildByName("gold");
            var num_right = right.getChildByName("num");
            if (duration){
                gold_right.getComponent(cc.Label).string =  gold_next ;
                num_right.active = true;
                num_right.getComponent(cc.Label).string =  duration_next ;
            } else {
                gold_right.getComponent(cc.Label).string =  gold_next;
                num_right.active = false;
            }


            this.m_diff.string = levelUp;
        }

        this.m_praise.string = this.com.saveData.praise;
        this.m_gold.string = this.com.saveData.gold;
        this.m_diamond.string = this.com.saveData.diamond;
    },

    showDesc: function(label, str){
        var line_count = 8;
        var str_new = "";
        var len = str.length;
        var start = 0;
        while (len > 0){
            str_new += str.substr(start, line_count);
            len -= line_count;
            start += line_count;
            if (len > 0) str_new += '\r\n';
        }

        label.string = str_new ;
    },

    btnClose: function(event, coustEvent) {
        if(this.node_anim) this.node.stopAction(this.node_anim);
        this.node.removeFromParent(true);
    },

    btnGroupRank: function(event, coustEvent) {
        var this_ = this;
        if (CC_WECHATGAME){
            wx.updateShareMenu({
                withShareTicket: true
            });
            cc.loader.loadRes("texture/share",function(err,data){
                wx.shareAppMessage({
                    title: "抖音上超火的网红游戏",
                    imageUrl: data.url,
                    success(res){
                        console.log("转发群成功!!!");
                        if(res.shareTickets == null || res.shareTickets == undefined || res.shareTickets == ""){
                            //没有群信息，说明分享的是个人
                            console.log("res.shareTickets is null");
                            wx.showModal({
                                //title:"分享失败",
                                content:"查看群排行需要分享到群",
                                showCancel:false
                            });
                        }else{
                            //有群信息
                            console.log("res.shareTickets is not null");
                            if(res.shareTickets.length > 0){
                                this.tex = new cc.Texture2D();
                                window.sharedCanvas.width = 1560;
                                window.sharedCanvas.height = 720;
                                window.wx.postMessage({
                                    messageType: 2,
                                    MAIN_MENU_NUM: "Cooking_fans",
                                    type: 1,
                                    shareTickets: res.shareTickets
                                });
                                this_.texView.node.active = true;
                                this_.tex_bg.node.active = true;
                            }
                            this_.com.setAchive(8, this_.node);
                        }
                    },
                    fail(res){
                        console.log("转发失败!!!");
                    }
                })
            });
        }
    },

    btn_back_qun(){
        this.texView.node.active = false;
        this.tex_bg.node.active = false;
    },

    btnBuy: function(event, coustEvent){
        console.log("升级")
        var levelUp = null;
        var item = this.com.getMachineItemByID(this._itemId);
        if (item != null){
            levelUp = item.levelUp;
        }
        var isDishes = false;
        if (levelUp == null){
            item = this.com.getDishesByID(this._itemId);
            if (item != null){
                isDishes = true;
                levelUp = item.LevelUp;
            }
        }

        if (levelUp == null || this.com.saveData.gold < levelUp){
            //金币不足
            console.log("金币不足");
            //this.popup.tip(this.node, "金币不足");

            var dlgGiveGold = cc.instantiate(this.m_dlgGiveGold);
            dlgGiveGold.parent = this.node;

            return;
        }

        this.com.setComData("gold", this.com.saveData.gold - levelUp);
        var itemType = Math.floor(this._itemId / 10);

        var shopItem = this.com.copyJsonObj(this.com.saveData.shopItem);
        shopItem[itemType.toString()] = this._itemId + 1;
        this.com.setComData("shopItem", shopItem);

        cc.audioEngine.playEffect(this.m_upGradeAudio, false);

        var evt = new cc.Event.EventCustom("upgradeItem", true);
        evt.setUserData({
            itemId: this._itemId + 1,
            isDishes: isDishes
        });
        this.node.dispatchEvent(evt);

        if(this.node_anim) this.node.stopAction(this.node_anim);
        this.node.removeFromParent(true);
    },

    btnGetGold: function(event, coustEvent){
        var dlgGiveGold = cc.instantiate(this.m_dlgGiveGold);
        dlgGiveGold.parent = this.node;
    },

    upGold: function(event){
        this.m_gold.string = this.com.saveData.gold;
    },

    upDiamond: function(event){
        this.m_diamond.string = this.com.saveData.diamond;
    },

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.texView.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },
    update() {
        this._updateSubDomainCanvas();
    },

    // update (dt) {},
});
