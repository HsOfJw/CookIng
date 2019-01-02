cc.Class({
    extends: cc.Component,

    properties: {
        m_achiveItem: cc.Prefab,
        m_dlgAward: cc.Prefab,
        m_scrollViewContent: cc.Node,
    },

    onLoad () {
        this.com = require('common');
        this.httpUtils = require("httpUtils");

        this.node.on('getAchivementAward', this.getAchivementAward, this);

        var this_ = this;
        this.node_anim = this.node.runAction(cc.sequence(
            cc.scaleTo(0.05, 1.1),
            cc.scaleTo(0.2, 1.0),
            cc.callFunc(function(){
                this_.selBtn(0);
            })
        ));
        var bg = this.node.getChildByName("bg");
        bg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["jpg_jiangbei_ditu"]);

        var yeqianditu = this.node.getChildByName("yeqianditu");
        yeqianditu.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_jiangbei_yeqianditu"]);

        var fanhui = this.node.getChildByName("fanhui");
        fanhui.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_jiangbei_fanhui"]);
    },

    init_0: function() {
        this.m_scrollViewContent.removeAllChildren(true);

        for (var i=0; i<this.com.cfgAchive.length; i++){
            var achive = cc.instantiate(this.m_achiveItem);
            this.m_scrollViewContent.addChild(achive);
            achive.getComponent("LyAchivementItem").init(this.com.cfgAchive[i]);
        }
        if (CC_WECHATGAME) wx.hideLoading();
    },

    init_1: function() {
        this.m_scrollViewContent.removeAllChildren(true);

        for (var i=0; i<this.com.cfgAchive.length; i++){
            var hasGet = false;
            for (var key in this.com.saveData.achiveHistory){
                if (this.com.saveData.achiveHistory[key] == this.com.cfgAchive[i].id){
                    hasGet = true;
                    break;
                }
            }

            if (!hasGet){
                var achive = cc.instantiate(this.m_achiveItem);
                this.m_scrollViewContent.addChild(achive);
                achive.getComponent("LyAchivementItem").init(this.com.cfgAchive[i]);
            }
        }
    },

    selBtn: function(btnId){
        if (this._btnId == btnId)
            return;
            
        this._btnId = btnId;

        var btnAll = this.node.getChildByName("quanbuanniu");
        var btnGet = this.node.getChildByName("weihuodeanniu");
        if (btnId){
            btnAll.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_jiangbei_quanbuhuise"]);
            btnGet.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_jiangbei_weihuodeanniu"]);
        } else {
            btnAll.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_jiangbei_quanbuanniu"]);
            btnGet.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_jiangbei_weihuodehuise"]);
        }

        if (btnId == 0) this.init_0();
        if (btnId == 1) this.init_1();
    },

    btnAll: function(event, coustEvent) {
        this.selBtn(0);
    },

    btnGet: function(event, coustEvent) {
        this.selBtn(1);
    },

    btnClose: function(event, coustEvent) {
        if(this.node_anim) this.node.stopAction(this.node_anim);
        
        this.node.dispatchEvent(new cc.Event.EventCustom("closeAchivement", true));

        this.node.removeFromParent(true);
    },

    getAchivementAward: function(event){
        var param = event.getUserData();

        var lyAward = cc.instantiate(this.m_dlgAward);
        lyAward.parent = this.node;
        lyAward.getComponent("dlgAward").init(param.awardType, param.awardNum);

        event.stopPropagation();
    },
});
