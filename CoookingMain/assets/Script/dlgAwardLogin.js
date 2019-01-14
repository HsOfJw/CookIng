cc.Class({
    extends: cc.Component,

    properties: {
        m_lbName: cc.Label,//
        m_lbName1: cc.Label,
        m_lbName2: cc.Label,
        m_des: cc.Label
    },

    onLoad() {
        this.com = require('common');
        this.node_anim = this.node.runAction(cc.sequence(
            cc.scaleTo(0.05, 1.1),
            cc.scaleTo(0.2, 1.0)
        ));

        this.com.loadTexture(this.node, ["X"], "png_shejiao_chazhao_X");

        this.showBanner();
    },

    init(type, name, type1, name1, type2, name2, num) {
        if (type == 1) {
            this.com.loadTexture(this.node, ["spItem"], "png_jiangbei_jinbi");
        } else if (type == 2) {
            this.com.loadTexture(this.node, ["spItem"], "png_jiangbei_zuanshi");
        } else if (type == 3) {
            this.com.loadTexture(this.node, ["spItem"], "png_jiangbei_binqilin");
        }

        //this.m_lbName.string = "<color=#9C651F><b>X" + name + "</b></color>";
        this.m_lbName.string = "X" + name;

        if (type1 == 1) {
            this.com.loadTexture(this.node, ["spItem1"], "png_jiangbei_jinbi");
        } else if (type1 == 2) {
            this.com.loadTexture(this.node, ["spItem1"], "png_jiangbei_zuanshi");
        } else if (type1 == 3) {
            this.com.loadTexture(this.node, ["spItem1"], "png_jiangbei_binqilin");
        }

        //this.m_lbName1.string = "<color=#9C651F><b>X" + name1 + "</b></color>";
        this.m_lbName1.string = "X" + name1;

        if (type2 == 1) {
            this.com.loadTexture(this.node, ["spItem2"], "png_jiangbei_jinbi");
        } else if (type2 == 2) {
            this.com.loadTexture(this.node, ["spItem2"], "png_jiangbei_zuanshi");
        } else if (type2 == 3) {
            this.com.loadTexture(this.node, ["spItem2"], "png_jiangbei_binqilin");
        }

        // this.m_lbName2.string = "<color=#9C651F><b>X" + name2 + "</b></color>";
        this.m_lbName2.string = "X" + name2 ;

        //this.m_des.string = "<b>邀请好友" + num + "人，获得丰厚奖励！</b>";
        this.m_des.string = "邀请好友" + num + "人，获得丰厚奖励！";
    },

    showBanner: function () {
        if (CC_WECHATGAME) {
            let winSize = wx.getSystemInfoSync();
            console.log(winSize);
            let bannerHeight = 80;
            let bannerWidth = 300;
            if (this._bannerAd == null) {
                this._bannerAd = wx.createBannerAd({
                    adUnitId: 'adunit-2d78bbddea098b1e',  //填写广告id
                    style: {
                        left: (winSize.windowWidth - bannerWidth) / 2,
                        top: winSize.windowHeight - bannerHeight,
                        width: bannerWidth,
                    }
                });
            }
            this._bannerAd.show();  //banner 默认隐藏(hide)  要打开
            //微信缩放后得到banner的真实高度，从新设置banner的top 属性
            this._bannerAd.onResize(res => {
                this._bannerAd.style.top = winSize.windowHeight - this._bannerAd.style.realHeight;
            })
        }
    },

    btnClose: function (event, coustEvent) {
        if (this._bannerAd) this._bannerAd.hide();

        this.node.dispatchEvent(new cc.Event.EventCustom("closeLoginAward", true));
        this.node.removeFromParent(true);
    },
    // update (dt) {},
});
