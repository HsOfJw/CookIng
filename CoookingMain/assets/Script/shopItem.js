cc.Class({
    extends: cc.Component,

    properties: {
        // m_item: cc.Button,
        m_price: cc.Label,
        m_img_Shop_Recommend: cc.Sprite,
        bg: cc.Node,
        show: cc.Node,
        m_itemId: -1,
        m_upgrade: sp.Skeleton,
    },

    onLoad () {
        this.com = require('common');
        this.httpUtils = require("httpUtils");
        this.m_img_Shop_Recommend.node.active = false;
        var fullGrade = this.show.getChildByName("fullGrade");
        fullGrade.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_fullGrade"]);
        this.m_img_Shop_Recommend.spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_Shop_Recommend"]);
        var shop_Price_Frame = this.show.getChildByName("shop_Price_Frame");
        shop_Price_Frame.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shop_Price_Frame"]);
    },

    start () {

    },

    init: function(itemId){
        this.m_itemId = itemId;
        var gold = null;

        var item = this.com.getMachineItemByID(itemId);
        if (item){
            gold = item.levelUp;
        } else {
            item = this.com.getDishesByID(itemId);
            if (item){
                gold = item.LevelUp;
            }
        }
        
        var item = this.node.getChildByName("bg");
        item.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_" + itemId.toString() + "_s"]);
        if (gold == null || gold == 0){
            //this.m_price.node.active = false;
            this.show.getChildByName("fullGrade").x = 60;
        } else {
            this.m_price.string = gold;
            //this.m_price.node.active = true;
            this.show.getChildByName("fullGrade").x = 10000;
        }

        this.m_upgrade.node.x = 10000;
    },

    setChoose(str){
        if(str == "wai"){
            this.bg.active = false;
            this.show.active = true;
        }else if(str == "li"){
            this.bg.active = true;
            this.show.active = false;
        }
    },

    setShopRecommendShow(bool){
        this.m_img_Shop_Recommend.node.active = bool;
    },

    BtnBuy: function(event, coustEvent){
        var item_next = this.com.getMachineItemByID(this.m_itemId + 1);
        
        if (item_next == null)
            item_next = this.com.getDishesByID(this.m_itemId + 1);

        if (this.com.saveData.month == 1 && this.com.saveData.newbie == 4203 && this.com.isSave){
            var parent = this.node;
            while (parent.parent != null){
                parent = parent.parent;
            }
            var script_gameUI = parent.children[0].getComponent("GameUI");
            if (this.com.saveData.curStore == 2){
                script_gameUI = parent.children[0].getComponent('CookingUI');
            }
            this.com.showGuide(4204, parent.children[0], script_gameUI.m_newbie);
        }

        if (item_next == null){
            var evt = new cc.Event.EventCustom("openItemInfo", true);
            evt.setUserData({
                itemId: this.m_itemId,
            });
            this.node.dispatchEvent(evt);
            return;
        }

        var evt = new cc.Event.EventCustom("openUpgrade", true);
        evt.setUserData({
            itemId: this.m_itemId,
        });
        this.node.dispatchEvent(evt);
    },

    // update (dt) {},
});
