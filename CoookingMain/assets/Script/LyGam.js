cc.Class({
    extends: cc.Component,

    properties: {
        m_gamItem: cc.Prefab,
        m_findFriend: cc.Prefab,
        m_ndChange: cc.Node,
        m_scrollNode: cc.Node,
        m_times: cc.Label,
    },

    onLoad() {
        this.com = require('common');
        this.httpUtils = require("httpUtils");
        this.node_anim = this.node.runAction(cc.sequence(
            cc.scaleTo(0.05, 1.1),
            cc.scaleTo(0.2, 1.0)
        ));
        var ditu = this.node.getChildByName("ditu");
        ditu.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_ditu"]);

        var fanhui = this.node.getChildByName("fanhui");
        fanhui.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shengji_fanhui"]);

        var hengxian = this.node.getChildByName("change").getChildByName("hengxian");
        hengxian.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_hengxian"]);

        var huanyipi = this.node.getChildByName("change").getChildByName("huanyipi");
        huanyipi.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_huanyipi"]);

        this.selBtn(0);
    },

    btnChange: function (event, coustEvent) {
        this.m_scrollNode.removeAllChildren(true);

        var node = event.target;
        node.getComponent(cc.Button).enabled = false;
        node.color = cc.color(180, 180, 180, 255);
        node.runAction(cc.sequence(
            cc.delayTime(10),
            cc.callFunc(function (target, customData) {
                target.getComponent(cc.Button).enabled = true;
                node.color = cc.color(255, 255, 255, 255);
            })
        ));

        this.funcBtn1();
    },

    btnRecommend: function (event, coustEvent) {
        this.selBtn(0);
    },

    funcBtn1: function () {
        var getRecommendTimer = cc.sys.localStorage.getItem("getRecommendTimer");
        var now = Math.floor(Date.now() / 1000);
        if (getRecommendTimer && now - getRecommendTimer < 10) {
            var time = 10 - (now - getRecommendTimer);
            var node = this.node.getChildByName("change").getChildByName("huanyipi");
            node.getComponent(cc.Button).enabled = false;
            node.color = cc.color(180, 180, 180, 255);
            node.runAction(cc.sequence(
                cc.delayTime(time),
                cc.callFunc(function (target, customData) {
                    target.getComponent(cc.Button).enabled = true;
                    node.color = cc.color(255, 255, 255, 255);
                })
            ));

            var data = cc.sys.localStorage.getItem("recommend");
            var jsonD = JSON.parse(data);
            for (var i in jsonD.data) {
                var item = cc.instantiate(this.m_gamItem);
                this.m_scrollNode.addChild(item);
                item.getComponent('LyGamItem').init(jsonD.data[i]);
            }
        } else {
            var this_ = this;

            var usrId = cc.sys.localStorage.getItem("usrId");
            var params = {
                usrId: usrId,
            };
            var token = cc.sys.localStorage.getItem("Token");
            var url = this.com.serverUrl + "/user/getRecommend";
            this.httpUtils._instance.httpPost(url, JSON.stringify(params), function (data) {
                console.log(data);
                cc.sys.localStorage.setItem("recommend", data);
                cc.sys.localStorage.setItem("getRecommendTimer", now);

                var jsonD = JSON.parse(data);

                if (jsonD["errcode"] === 0) {
                    var node = this_.node.getChildByName("change").getChildByName("huanyipi");
                    node.getComponent(cc.Button).enabled = false;
                    node.color = cc.color(180, 180, 180, 255);
                    node.runAction(cc.sequence(
                        cc.delayTime(10),
                        cc.callFunc(function (target, customData) {
                            target.getComponent(cc.Button).enabled = true;
                            node.color = cc.color(255, 255, 255, 255);
                        })
                    ));

                    for (var i in jsonD.data) {
                        var item = cc.instantiate(this_.m_gamItem);
                        this_.m_scrollNode.addChild(item);
                        item.getComponent('LyGamItem').init(jsonD.data[i]);
                    }
                } else {
                    console.log(jsonD.msg)
                }
                this_.getVisit();
            }, token);
        }
    },

    getVisit: function () {
        var this_ = this;

        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId,
        };
        var token = cc.sys.localStorage.getItem("Token");
        var url = this.com.serverUrl + "/user/getVisit";
        this.httpUtils._instance.httpPost(url, JSON.stringify(params), function (data) {
            var jsonD = JSON.parse(data);
            if (jsonD["errcode"] === 0) {
                if (jsonD.data < 3) {
                    // this_.m_times.string = "<b>" + jsonD.data + "/3</b>"
                    this_.m_times.string = jsonD.data + "/3"
                } else {
                    // this_.m_times.string = "<b>3/3</b>";
                    this_.m_times.string = "3/3";
                }
            } else {
                // this_.m_times.string = "<b>3/3</b>";
                this_.m_times.string = "3/3";
            }
        }, token);
    },

    btnFans: function (event, coustEvent) {
        this.selBtn(1);

        if (CC_WECHATGAME) wx.aldSendEvent('社交-我的粉丝', {});
    },

    funcBtn2: function () {
        var getFansTimer = cc.sys.localStorage.getItem("getFansTimer");
        var now = Math.floor(Date.now() / 1000);
        if (getFansTimer && now - getFansTimer < 10) {
            var data = cc.sys.localStorage.getItem("fans");
            var jsonD = JSON.parse(data);
            for (var i in jsonD.data) {
                var item = cc.instantiate(this.m_gamItem);
                this.m_scrollNode.addChild(item);
                item.getComponent('LyGamItem').init(jsonD.data[i]);
            }
        } else {
            var this_ = this;

            var usrId = cc.sys.localStorage.getItem("usrId");
            var params = {
                usrId: usrId,
            };
            var token = cc.sys.localStorage.getItem("Token");
            var url = this.com.serverUrl + "/user/getFans";
            this.httpUtils._instance.httpPost(url, JSON.stringify(params), function (data) {
                console.log(data);
                cc.sys.localStorage.setItem("fans", data);
                cc.sys.localStorage.setItem("getFansTimer", now);

                var jsonD = JSON.parse(data);

                if (jsonD["errcode"] === 0) {
                    for (var i in jsonD.data) {
                        var item = cc.instantiate(this_.m_gamItem);
                        this_.m_scrollNode.addChild(item);
                        item.getComponent('LyGamItem').init(jsonD.data[i]);
                    }
                } else {
                    console.log(jsonD.msg)
                }
            }, token);
        }
    },

    btnFollows: function (event, coustEvent) {
        this.selBtn(2);

        if (CC_WECHATGAME) wx.aldSendEvent('社交-我的关注', {});
    },

    funcBtn3: function () {
        var getFollowsTimer = cc.sys.localStorage.getItem("getFollowsTimer");
        var now = Math.floor(Date.now() / 1000);
        if (getFollowsTimer && now - getFollowsTimer < 10) {
            var data = cc.sys.localStorage.getItem("follows");
            var jsonD = JSON.parse(data);
            for (var i in jsonD) {
                var item = cc.instantiate(this.m_gamItem);
                this.m_scrollNode.addChild(item);
                item.getComponent('LyGamItem').init(jsonD[i]);
            }
        } else {
            var this_ = this;

            var usrId = cc.sys.localStorage.getItem("usrId");
            var params = {
                usrId: usrId,
            };
            var token = cc.sys.localStorage.getItem("Token");
            var url = this.com.serverUrl + "/user/getFollows";
            this.httpUtils._instance.httpPost(url, JSON.stringify(params), function (data) {
                console.log(data);
                var jsonD = JSON.parse(data);
                cc.sys.localStorage.setItem("follows", JSON.stringify(jsonD.data.follows));
                cc.sys.localStorage.setItem("getFollowsTimer", now);

                if (jsonD["errcode"] === 0) {
                    for (var i in jsonD.data.follows) {
                        var item = cc.instantiate(this_.m_gamItem);
                        this_.m_scrollNode.addChild(item);
                        item.getComponent('LyGamItem').init(jsonD.data.follows[i]);
                    }
                } else {
                    console.log(jsonD.msg)
                }
            }, token);
        }
    },

    btnFind: function (event, coustEvent) {
        var this_ = this;

        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            gameType: this.com.project_name,
            usrId: usrId,
            friendId: usrId
        };
        var token = cc.sys.localStorage.getItem("Token");
        var url = this.com.serverUrl + "/user/findUser";
        this.httpUtils._instance.httpPost(url, JSON.stringify(params), function (data) {
            console.log(data);

            var jsonD = JSON.parse(data);

            if (jsonD["errcode"] === 0) {
                var find = cc.instantiate(this_.m_findFriend);
                find.parent = this_.node;
                find.getComponent("LyFindFriend").init(jsonD.data.data, jsonD.data.isFollow);
            } else {
                console.log(jsonD.msg)
            }
        }, token);
    },

    selBtn: function (btnId) {
        if (this._btnId == btnId)
            return;

        this._btnId = btnId;

        var btnRecommend = this.node.getChildByName("btnRecommend");
        var btnFans = this.node.getChildByName("btnFans");
        var btnFollows = this.node.getChildByName("btnFollows");
        var btnFind = this.node.getChildByName("btnFind");

        btnRecommend.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_tuijianzi"]);
        btnFans.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_fensizi"]);
        btnFollows.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_guanzhuzi"]);
        btnFind.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_chazhao"]);
        this.m_ndChange.x = -10000;

        this.m_scrollNode.removeAllChildren(true);

        if (btnId == 0) {
            btnRecommend.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_tuijian"]);
            this.m_ndChange.x = 0;
            this.funcBtn1();
        }
        if (btnId == 1) {
            btnFans.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_fensi"]);
            this.funcBtn2();
        }
        if (btnId == 2) {
            btnFollows.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_guanzhu"]);
            this.funcBtn3();
        }
    },

    btnClose: function (event, coustEvent) {
        if (this.node_anim) this.node.stopAction(this.node_anim);
        this.node.dispatchEvent(new cc.Event.EventCustom("closeGam", true));

        this.node.removeFromParent(true);
    },
});
