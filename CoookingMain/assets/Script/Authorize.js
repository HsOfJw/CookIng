cc.Class({
    extends: cc.Component,

    properties: {
        m_btnAuthorize: cc.Button,
        m_node1: cc.Node,
        m_node2: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.com = require('common');
        this.httpUtils = require("httpUtils");

        this.com.res_loaded["png_beijng"].update({premultiplyAlpha: true});

        var beijng = this.node.getChildByName("beijng");
        beijng.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_beijng"]);
        
        var cha = this.node.getChildByName("cha");
        cha.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_cha"]);

        var node1 = this.node.getChildByName("node1");
        var shouquan = node1.getChildByName("shouquan");
        shouquan.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shouquan"]);
        var songli = node1.getChildByName("songli");
        songli.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_songli"]);

        this.createAuthorizeBtn(this.m_btnAuthorize.node);

        this.m_node1.x = 0;
        this.m_node2.x = 1000;
    },

    createAuthorizeBtn: function(btnNode) {
        let btnSize = cc.size(btnNode.width+10,btnNode.height+10);
        let frameSize = cc.view.getFrameSize();
        let winSize = cc.director.getWinSize();
        // console.log("winSize: ",winSize);
        // console.log("frameSize: ",frameSize);
        //适配不同机型来创建微信授权按钮
        let left = (winSize.width*0.5+btnNode.x-btnSize.width*0.5)/winSize.width*frameSize.width;
        let top = (winSize.height*0.5-btnNode.y-btnSize.height*0.5)/winSize.height*frameSize.height;
        let width = btnSize.width/winSize.width*frameSize.width;
        let height = btnSize.height/winSize.height*frameSize.height;
        // console.log("button pos: ",cc.v2(left,top));
        // console.log("button size: ",cc.size(width,height));
    
        let self = this;
        self.btnAuthorize = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: left,
                top: top,
                width: width,
                height: height,
                lineHeight: 0,
                backgroundColor: '',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            }
        });
    
        self.btnAuthorize.onTap((uinfo) => {
            console.log("onTap uinfo: ",uinfo);
            if (uinfo.userInfo) {
                console.log("wxLogin auth success");
                //wx.showToast({title:"授权成功"});

                self.m_node1.x = 1000;
                self.m_node2.x = 0;

                var parent = self.node.parent;
                var script = parent.getComponent('MainUI');
                script.upDataNick(script);
            }else {
                console.log("wxLogin auth fail");

                wx.showToast({title:"授权失败"});
            }
            self.node.removeFromParent(true);
            self.btnAuthorize.destroy();
        });
    },

    btnClose: function(event, coustEvent) {
        this.node.removeFromParent(true);
    },

    // update (dt) {},
});
