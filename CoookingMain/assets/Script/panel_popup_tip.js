
cc.Class({
    extends: cc.Component,

    properties: {
        lab_tip: cc.Label
    },

    onLoad () {
        this.com = require('common');
        var Img_Bg = this.node.getChildByName("Img_Bg");
        Img_Bg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_popup"]);
    },
    
    set_info (info,cb) {
        var self = this;
        var flowup = cc.moveBy(2, cc.v2(0, 100), 100);
        var fadeout = cc.fadeOut(2);
        self.node.runAction(cc.sequence(cc.spawn(flowup, fadeout), cc.callFunc(
            cb
        )));
    	this.lab_tip.string = info;
    },

    set_cb (cb) {
    	this.cb = cb;
    },

});