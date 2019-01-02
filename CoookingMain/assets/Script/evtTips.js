cc.Class({
    extends: cc.Component,

    properties: {
        m_name: cc.RichText,
        m_des: cc.RichText,
        m_sp: cc.Sprite,
    },

    onLoad () {
        this.com = require('common');
        this.httpUtils = require("httpUtils");
        this.node_anim = this.node.runAction(cc.sequence(
            cc.scaleTo(0.05, 1.1),
            cc.scaleTo(0.2, 1.0)
        ));
        var bg = this.node.getChildByName("bg");
        bg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_xinshijian_ditu"]);

        var btnReturn = this.node.getChildByName("btnReturn");
        btnReturn.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_xinshijian_cha"]);
    },

    start () {

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

        label.string = "<b>" + str_new + "</b>";
    },

    init: function(evtInfo){
        this.m_name.string = "<b>" + evtInfo.name + "</b>",
        
        //this.m_des.string = "<b>" + evtInfo.des + "</b>",
        this.showDesc(this.m_des, evtInfo.des);

        this.m_sp.spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_" + evtInfo.pic]);
    },

    btnClose: function(event, coustEvent) {
        if(this.node_anim) this.node.stopAction(this.node_anim);
        this.node.dispatchEvent(new cc.Event.EventCustom("closeEvtInfo", true));

        this.node.removeFromParent(true);
    },
});
