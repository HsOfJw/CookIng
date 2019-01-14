cc.Class({
    extends: cc.Component,

    properties: {
        m_praise: cc.Label,
        m_gold: cc.Label,
        m_diamond: cc.Label,
    },

    onLoad () {
        this.com = require('common');
        this.httpUtils = require("httpUtils");
        this.node_anim = this.node.runAction(cc.sequence(
            cc.scaleTo(0.05, 1.1),
            cc.scaleTo(0.2, 1.0)
        ));
        var cha = this.node.getChildByName("btnReturn");
        cha.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shengji_fanhui"]);

        var qunpaihang = this.node.getChildByName("groupRank");
        qunpaihang.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_qunpaihang"]);

        var aixin = this.node.getChildByName("aixin");
        aixin.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_zhujiemian_aixin"]);

        var jinbi = this.node.getChildByName("jinbi");
        jinbi.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_zhujiemian_jinbi"]);

        var zuanshi = this.node.getChildByName("zuanshi");
        zuanshi.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_zhujiemian_zuanshi"]);

        var lbg = this.node.getChildByName("left").getChildByName("bg");
        lbg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shengji_ditu"]);
    },

    start () {
    },

    init: function(itemId){
        this._itemId = itemId;

        var des = null;
        var gold = null;
        var duration = null;

        var item = this.com.getMachineItemByID(itemId);
        if (item){
            des = item.des;
            gold = "数量:"+item.num;
            if (item.duration) duration = item.duration+"秒";
        } else {
            item = this.com.getDishesByID(itemId);
            if (item){
                des = item.des;
                gold = "价格:"+item.price;
            }
        }

        var left = this.node.getChildByName("left");
        var name_left = left.getChildByName("name");
        name_left.getComponent(cc.Label).string = item.name ;
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
            gold_left.getComponent(cc.Label).string =  gold ;
            num_left.active = false;
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

        label.string =str_new ;
    },

    btnClose: function(event, coustEvent) {
        if(this.node_anim) this.node.stopAction(this.node_anim);
        this.node.removeFromParent(true);
    },

    btnGroupRank: function(event, coustEvent) {

    },

    // update (dt) {},
});
