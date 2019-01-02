cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        this.com = require('common');
    },

    start () {

    },

    init: function(evtId){
        this.evtInfo = this.com.getEventInfo(evtId);

        var item = this.node.getChildByName("item");
        item.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_" + this.evtInfo.pic]);
    },

    btnClick: function(event, customData){
        var evt = new cc.Event.EventCustom("showEvtInfo", true);
        evt.setUserData({
            evtInfo: this.evtInfo
        });
        this.node.dispatchEvent(evt);
    },
});
