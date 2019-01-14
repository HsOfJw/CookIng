cc.Class({
    extends: cc.Component,

    properties: {
        rankItem: cc.Prefab,
        friend: cc.Prefab,
        avatarImgSprite: cc.Sprite,
        nickLabel: cc.Label,
        desLabel: cc.Label,
        numLabel: cc.Label,
        sexSprite: cc.Sprite,
        myRankLabel: cc.Label,
        rankingScrollView: cc.ScrollView,
        scrollViewContent: cc.Node,
        texView: cc.Sprite,//显示排行榜
    },

    onLoad() {
        this.com = require('common');
        this.httpUtils = require("httpUtils");
        this.node_anim = this.node.runAction(cc.sequence(
            cc.scaleTo(0.05, 1.1),
            cc.scaleTo(0.2, 1.0)
        ));
        this.node.on('showUserInfo', this.showUserInfo, this);

        var ditu = this.node.getChildByName("ditu");
        ditu.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_paihangbang_ditu"]);

        var fanhui = this.node.getChildByName("fanhui");
        fanhui.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_jiangbei_fanhui"]);
        fanhui.zIndex = 104;

        var spMineBg = this.node.getChildByName("mineRank").getChildByName("spMineBg");
        spMineBg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_paihangbang_wodepaiming"]);

        this.selBtnV(0);
        this.selBtnH(1);

        this._curFansLen = 0;
        this._curPraiseLen = 0;
        this._isLoading = false;
        this._duration = 1;//5*60;

        var this_ = this;
        this.rankingScrollView.node.on('bounce-bottom', function (event) {
            if (this_._btnHId == 0) this_.showFans();
            if (this_._btnHId == 1) this_.showPraise();
        });
        this.initPraiseView();

        if (CC_WECHATGAME) {
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 1560;
            window.sharedCanvas.height = 720;
        }
    },

    showFans: function () {
        if (this._isMaxFansRank) return;

        var now = Math.floor(Date.now() / 1000);
        var old = cc.sys.localStorage.getItem("Timestamp_FansRank");
        if (old == null) old = 0;

        var length = cc.sys.localStorage.getItem("fansRankingLength");

        if (now - old < this._duration && this._curFansLen < length) {
            length = this._curFansLen + 10 > length ? length : this._curFansLen + 10;
            for (let i = this._curFansLen; i < length; i++) {
                var playerInfo = cc.sys.localStorage.getItem("fansRanking_" + i);
                var item = cc.instantiate(this.rankItem);
                this.scrollViewContent.addChild(item);
                item.getComponent('LyRankItem').init(i, playerInfo, 1);
            }

            var myFansRank = cc.sys.localStorage.getItem("myFansRank");
            if (myFansRank) {
                var mineInfo = myFansRank;
                this.showMineRank(myFansRank, true);
            }

            this._curFansLen = length;
        } else if (this._isLoading == false) {
            this._isLoading = true;

            var usrId = cc.sys.localStorage.getItem("usrId");
            var params = {
                usrId: usrId,
                start: this._curFansLen,
                end: this._curFansLen + 10
            };

            var token = cc.sys.localStorage.getItem("Token");
            var url = this.com.serverUrl + "/user/fansRanking";
            var this_ = this;
            this.httpUtils._instance.httpPost(url, JSON.stringify(params), function (data) {
                //console.log(data);

                var jsonD = JSON.parse(data);
                if (jsonD["errcode"] === 0) {
                    for (var i = 0; i < jsonD.data.rank.length; i++) {
                        cc.sys.localStorage.setItem("fansRanking_" + (this_._curFansLen + i).toString(), jsonD.data.rank[i]);

                        var playerInfo = jsonD.data.rank[i];
                        if (playerInfo != null) {
                            var item = cc.instantiate(this_.rankItem);
                            this_.scrollViewContent.addChild(item);
                            item.getComponent('LyRankItem').init(this_._curFansLen + i, playerInfo, 1);
                        }
                    }

                    cc.sys.localStorage.setItem("myFansRank", jsonD.data.myRank);
                    this_.showMineRank(jsonD.data.myRank, true);

                    this_._curFansLen += jsonD.data.rank.length;
                    if (jsonD.data.rank.length < 10) {
                        this_._isMaxFansRank = true;
                    }
                    cc.sys.localStorage.setItem("fansRankingLength", this_._curFansLen);
                }
                this_._isLoading = false;
            }, token);
        }
    },

    showPraise: function () {
        if (this._isMaxPraiseRank) return;

        var now = Math.floor(Date.now() / 1000);
        var old = cc.sys.localStorage.getItem("Timestamp_PraiseRank");
        if (old == null) old = 0;

        var length = cc.sys.localStorage.getItem("praiseRankingLength");

        if (now - old < this._duration && this._curPraiseLen < length) {
            length = this._curPraiseLen + 10 > length ? length : this._curPraiseLen + 10;
            for (let i = this._curPraiseLen; i < length; i++) {
                var playerInfo = cc.sys.localStorage.getItem("praiseRanking_" + i);
                var item = cc.instantiate(this.rankItem);
                this.scrollViewContent.addChild(item);
                item.getComponent('LyRankItem').init(i, playerInfo, 0);
            }

            var myPraiseRank = cc.sys.localStorage.getItem("myPraiseRank");
            if (myPraiseRank) {
                this.showMineRank(myPraiseRank, false);
            }

            this._curPraiseLen = length;
        } else if (this._isLoading == false) {
            this._isLoading = true;

            var usrId = cc.sys.localStorage.getItem("usrId");
            var params = {
                usrId: usrId,
                gameType: this.com.project_name,
                start: this._curPraiseLen,
                end: this._curPraiseLen + 10
            };

            var token = cc.sys.localStorage.getItem("Token");
            var url = this.com.serverUrl + "/user/worldRanking";
            var this_ = this;
            this.httpUtils._instance.httpPost(url, JSON.stringify(params), function (data) {
                //console.log(data);

                var jsonD = JSON.parse(data);
                if (jsonD["errcode"] === 0) {
                    for (var i = 0; i < jsonD.data.rank.length; i++) {
                        cc.sys.localStorage.setItem("praiseRanking_" + (this_._curPraiseLen + i).toString(), jsonD.data.rank[i]);

                        var playerInfo = jsonD.data.rank[i];
                        if (playerInfo != null) {
                            var item = cc.instantiate(this_.rankItem);
                            this_.scrollViewContent.addChild(item);
                            item.getComponent('LyRankItem').init(this_._curPraiseLen + i, playerInfo, 0);
                        }
                    }

                    cc.sys.localStorage.setItem("myPraiseRank", jsonD.data.myRank);
                    this_.showMineRank(jsonD.data.myRank, false);

                    this_._curPraiseLen += jsonD.data.rank.length;
                    if (jsonD.data.rank.length < 10) {
                        this_._isMaxPraiseRank = true;
                    }
                    cc.sys.localStorage.setItem("praiseRankingLength", this_._curPraiseLen);
                }
                this_._isLoading = false;
            }, token);
        }
    },

    showMineRank: function (mineInfo, isFans) {
        this.node.getChildByName("mineRank").x = 0;

        var nickName = "";
        if (mineInfo.nickName && mineInfo.nickName != "null")
            nickName = mineInfo.nickName
        // this.nickLabel.string = "<b>" + nickName + "</b>";
        this.nickLabel.string = nickName;

        var des = "";
        if (mineInfo.des && mineInfo.des != "null")
            des = mineInfo.des;
        // this.desLabel.string = "<b>" + des + "</b>";
        this.desLabel.string = des;

        if (isFans) {
            var fans = 0;
            if (mineInfo.fans && mineInfo.fans != "null")
                fans = mineInfo.fans;
            // this.numLabel.string = "<b>金币: " + fans + "</b>";
            this.numLabel.string = "金币: " + fans;
        } else {
            var praise = 0;
            if (mineInfo.maxScore && mineInfo.maxScore != "null")
                praise = mineInfo.maxScore;
            // this.numLabel.string = "<b>好评: " + praise + "</b>";
            this.numLabel.string = "好评: " + praise;
        }

        if (mineInfo.sex) {
            this.sexSprite.spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_nv"]);
        } else {
            this.sexSprite.spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_nan"]);
        }

        // this.myRankLabel.string = "<b>我的排名：" + (mineInfo.rank + 1).toString() + "</b>";
        this.myRankLabel.string = "我的排名：" + (mineInfo.rank + 1).toString();

        this.createImage(mineInfo.avatarUrl);
    },

    selBtnV: function (btnId) {
        this._btnVId = btnId;

        var btnWorld = this.node.getChildByName("btnWorld");
        var btnFriend = this.node.getChildByName("btnFriend");
        var btnGroup = this.node.getChildByName("btnGroup");

        btnWorld.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_paihangbang_shijiebang_xiao"]);
        btnFriend.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_paihangbang_haoyoubang_xiao"]);
        btnGroup.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_paihangbang_qunpaihang_xiao"]);

        btnWorld.zIndex = 100;
        btnFriend.zIndex = 100;
        btnGroup.zIndex = 100;

        if (btnId == 0) {
            btnWorld.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_paihangbang_shijiebang_da"]);
            btnWorld.zIndex = 101;
        }
        if (btnId == 1) {
            btnFriend.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_paihangbang_haoyoubang_da"]);
            btnFriend.zIndex = 101;
        }
        if (btnId == 2) {
            btnGroup.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_paihangbang_qunpaihang_da"]);
            btnGroup.zIndex = 101;
        }
    },

    selBtnH: function (btnId) {
        this._btnHId = btnId;

        var btnFans = this.node.getChildByName("btnFans");
        var btnPraise = this.node.getChildByName("btnPraise");

        btnFans.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_paihangbang_fensipaiming_xiao"]);
        btnPraise.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_paihangbang_dianzanpaiming_xiao"]);

        if (btnId == 0) {
            btnFans.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_paihangbang_fensipaiming_da"]);
        }
        if (btnId == 1) {
            btnPraise.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_paihangbang_dianzanpaiming_da"]);
        }
    },

    initFansView: function () {
        let this_ = this;

        var now = Math.floor(Date.now() / 1000);
        var old = cc.sys.localStorage.getItem("Timestamp_FansRank");
        if (old == null) old = 0;
        if (now - old < this._duration) {
            this_.scrollViewContent.removeAllChildren();

            var length = cc.sys.localStorage.getItem("fansRankingLength");
            length = length > 10 ? 10 : length;
            for (let i = 0; i < length; i++) {
                var playerInfo = cc.sys.localStorage.getItem("fansRanking_" + i);
                var item = cc.instantiate(this_.rankItem);
                this_.scrollViewContent.addChild(item);
                item.getComponent('LyRankItem').init(i, playerInfo, 1);
            }

            var myFansRank = cc.sys.localStorage.getItem("myFansRank");
            if (myFansRank) {
                this_.showMineRank(myFansRank, true);
            }

            this_._curFansLen = length;

            if (length <= 5) {
                let layout = this_.scrollViewContent.getComponent(cc.Layout);
                //console.log(layout);
                layout.resizeMode = cc.Layout.ResizeMode.NONE;
            }
            return;
        }
        cc.sys.localStorage.setItem("Timestamp_FansRank", now);

        this._isLoading = true;

        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId,
            start: 0,
            end: 10
        };

        var token = cc.sys.localStorage.getItem("Token");
        var url = this.com.serverUrl + "/user/fansRanking";
        this.httpUtils._instance.httpPost(url, JSON.stringify(params), function (data) {
            //console.log(data);

            var jsonD = JSON.parse(data);
            if (jsonD["errcode"] === 0) {
                this_.scrollViewContent.removeAllChildren();
                for (let i = 0; i < jsonD.data.rank.length; i++) {
                    cc.sys.localStorage.setItem("fansRanking_" + i, jsonD.data.rank[i]);

                    var playerInfo = jsonD.data.rank[i];
                    var item = cc.instantiate(this_.rankItem);
                    this_.scrollViewContent.addChild(item);
                    item.getComponent('LyRankItem').init(i, playerInfo, 1);
                }

                cc.sys.localStorage.setItem("myFansRank", jsonD.data.myRank);
                this_.showMineRank(jsonD.data.myRank, true);

                this_._curFansLen = jsonD.data.rank.length;
                this_._isMaxFansRank = false;
                if (this_._curFansLen < 10) {
                    this_._isMaxFansRank = true;
                }
                cc.sys.localStorage.setItem("fansRankingLength", this_._curFansLen);
                if (jsonD.data.rank.length <= 5) {
                    let layout = this_.scrollViewContent.getComponent(cc.Layout);
                    //console.log(layout);
                    layout.resizeMode = cc.Layout.ResizeMode.NONE;
                }
            }
            this_._isLoading = false;
        }, token);
    },

    initPraiseView: function () {
        let this_ = this;

        var now = Math.floor(Date.now() / 1000);
        var old = cc.sys.localStorage.getItem("Timestamp_PraiseRank");
        if (old == null) old = 0;
        if (now - old < this._duration) {
            this_.scrollViewContent.removeAllChildren();

            var length = cc.sys.localStorage.getItem("praiseRankingLength");
            length = length > 10 ? 10 : length;
            for (let i = 0; i < length; i++) {
                var playerInfo = cc.sys.localStorage.getItem("praiseRanking_" + i);
                var item = cc.instantiate(this_.rankItem);
                this_.scrollViewContent.addChild(item);
                item.getComponent('LyRankItem').init(i, playerInfo, 0);
            }

            var myPraiseRank = cc.sys.localStorage.getItem("myPraiseRank");
            if (myPraiseRank) {
                this_.showMineRank(myPraiseRank, false);
            }

            this_._curPraiseLen = length;

            if (length <= 5) {
                let layout = this_.scrollViewContent.getComponent(cc.Layout);
                //console.log(layout);
                layout.resizeMode = cc.Layout.ResizeMode.NONE;
            }
            return;
        }
        cc.sys.localStorage.setItem("Timestamp_PraiseRank", now);

        this._isLoading = true;

        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId,
            gameType: this.com.project_name,
            start: 0,
            end: 10
        };

        var token = cc.sys.localStorage.getItem("Token");
        var url = this.com.serverUrl + "/user/worldRanking";
        this.httpUtils._instance.httpPost(url, JSON.stringify(params), function (data) {
            //console.log(data);

            var jsonD = JSON.parse(data);
            if (jsonD["errcode"] === 0) {
                this_.scrollViewContent.removeAllChildren();
                for (let i = 0; i < jsonD.data.rank.length; i++) {
                    cc.sys.localStorage.setItem("praiseRanking_" + i, jsonD.data.rank[i]);

                    var playerInfo = jsonD.data.rank[i];
                    var item = cc.instantiate(this_.rankItem);
                    this_.scrollViewContent.addChild(item);
                    item.getComponent('LyRankItem').init(i, playerInfo, 0);
                }

                cc.sys.localStorage.setItem("myPraiseRank", jsonD.data.myRank);
                this_.showMineRank(jsonD.data.myRank, false);

                this_._curPraiseLen = jsonD.data.rank.length;
                this_._isMaxPraiseRank = false;
                if (this_._curPraiseLen < 10) {
                    this_._isMaxPraiseRank = true;
                }
                cc.sys.localStorage.setItem("praiseRankingLength", this_._curPraiseLen);
                if (jsonD.data.rank.length <= 5) {
                    let layout = this_.scrollViewContent.getComponent(cc.Layout);
                    //console.log(layout);
                    layout.resizeMode = cc.Layout.ResizeMode.NONE;
                }
            }
            this_._isLoading = false;
        }, token);
    },

    btnPraise: function (event, coustEvent) {
        this.texView.node.active = false;
        this.selBtnH(1);

        if (CC_WECHATGAME) wx.aldSendEvent('天天有礼-分享', {});

        //世界
        if (this._btnVId == 0) {
            this.initPraiseView();
            this.rankingScrollView.node.x = 0;
        }
        //好友
        if (this._btnVId == 1) {
            this.node.getChildByName("mineRank").x = 10000;
            this.rankingScrollView.node.x = 10000;
            if (CC_WECHATGAME) {
                //window.wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
                this.tex = new cc.Texture2D();
                window.sharedCanvas.width = 1560;
                window.sharedCanvas.height = 720;
                window.wx.postMessage({
                    messageType: 0,
                    MAIN_MENU_NUM: "Cooking_praise",
                    type: 0
                });
                this.texView.node.active = true;
            }
        }
        //群
        if (this._btnVId == 2) {
            this.node.getChildByName("mineRank").x = 10000;
            this.rankingScrollView.node.x = 10000;
            this.qun_share();
        }
    },

    btnFans: function (event, coustEvent) {
        this.texView.node.active = false;
        this.selBtnH(0);

        if (CC_WECHATGAME) wx.aldSendEvent('排行榜-按粉丝排名', {});

        //世界
        if (this._btnVId == 0) {
            this.initFansView();
            this.rankingScrollView.node.x = 0;
        }
        //好友
        if (this._btnVId == 1) {
            this.node.getChildByName("mineRank").x = 10000;
            this.rankingScrollView.node.x = 10000;
            if (CC_WECHATGAME) {
                //window.wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
                this.tex = new cc.Texture2D();
                window.sharedCanvas.width = 1560;
                window.sharedCanvas.height = 720;
                window.wx.postMessage({
                    messageType: 0,
                    MAIN_MENU_NUM: "Cooking_fans",
                    type: 1
                });
                this.texView.node.active = true;
            }
        }
        //群
        if (this._btnVId == 2) {
            this.node.getChildByName("mineRank").x = 10000;
            this.rankingScrollView.node.x = 10000;
            this.qun_share();
        }
    },

    btnWorld: function (event, coustEvent) {
        this.selBtnV(0);
        this.texView.node.active = false;
        this.rankingScrollView.node.x = 0;
        // console.log("world", this._btnHId);
        //粉丝
        if (this._btnHId == 0) {
            this.initFansView();
        }
        //点赞
        if (this._btnHId == 1) {
            this.initPraiseView();
        }
    },

    btnFriend: function (event, coustEvent) {
        this.selBtnV(1);
        this.scrollViewContent.removeAllChildren(true);
        this.texView.node.active = true;

        if (CC_WECHATGAME) wx.aldSendEvent('排行榜-好友榜', {});

        this.node.getChildByName("mineRank").x = 10000;
        this.rankingScrollView.node.x = 10000;
        // console.log("friend", this._btnHId);
        //粉丝
        if (this._btnHId == 0) {
            if (CC_WECHATGAME) {
                //window.wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
                this.tex = new cc.Texture2D();
                window.sharedCanvas.width = 1560;
                window.sharedCanvas.height = 720;
                window.wx.postMessage({
                    messageType: 0,
                    MAIN_MENU_NUM: "Cooking_fans",
                    type: 1
                });
            }
        }
        //点赞
        if (this._btnHId == 1) {
            if (CC_WECHATGAME) {
                //window.wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
                this.tex = new cc.Texture2D();
                window.sharedCanvas.width = 1560;
                window.sharedCanvas.height = 720;
                window.wx.postMessage({
                    messageType: 0,
                    MAIN_MENU_NUM: "Cooking_praise",
                    type: 0
                });
            }
        }
    },

    btnGroup: function (event, coustEvent) {
        this.selBtnV(2);

        if (CC_WECHATGAME) wx.aldSendEvent('排行榜-群排名', {});

        this.texView.node.active = false;
        this.scrollViewContent.removeAllChildren(true);
        this.node.getChildByName("mineRank").x = 10000;
        this.rankingScrollView.node.x = 10000;
        // console.log("qun", this._btnHId);
        //粉丝
        this.qun_share();
    },

    qun_share() {
        var this_ = this;
        if (CC_WECHATGAME) {
            wx.updateShareMenu({
                withShareTicket: true
            });
            cc.loader.loadRes("texture/share", function (err, data) {
                wx.shareAppMessage({
                    title: "抖音上超火的网红游戏",
                    imageUrl: data.url,
                    success(res) {
                        console.log("转发群成功!!!");
                        if (res.shareTickets == null || res.shareTickets == undefined || res.shareTickets == "") {
                            //没有群信息，说明分享的是个人
                            console.log("res.shareTickets is null");
                            wx.showModal({
                                //title:"分享失败",
                                content: "查看群排行需要分享到群",
                                showCancel: false
                            });
                        } else {
                            //有群信息
                            console.log("res.shareTickets is not null");
                            if (res.shareTickets.length > 0) {
                                if (this._btnHId == 0) {
                                    this.tex = new cc.Texture2D();
                                    window.sharedCanvas.width = 1560;
                                    window.sharedCanvas.height = 720;
                                    window.wx.postMessage({
                                        messageType: 2,
                                        MAIN_MENU_NUM: "Cooking_fans",
                                        type: 1,
                                        shareTickets: res.shareTickets
                                    });
                                } else if (this._btnHId == 1) {
                                    this.tex = new cc.Texture2D();
                                    window.sharedCanvas.width = 1560;
                                    window.sharedCanvas.height = 720;
                                    window.wx.postMessage({
                                        messageType: 2,
                                        MAIN_MENU_NUM: "Cooking_praise",
                                        type: 0,
                                        shareTickets: res.shareTickets
                                    });
                                }
                                this_.com.shareView = 2;
                                this_.com.shareTickets = res.shareTickets;
                                this_.texView.node.active = true;
                            }
                            this_.com.setAchive(8, this_.node);
                        }
                    },
                    fail(res) {
                        console.log("转发失败!!!");
                    }
                })
            });
        }
    },

    btnClose: function (event, coustEvent) {
        if (this.node_anim) this.node.stopAction(this.node_anim);
        this.node.dispatchEvent(new cc.Event.EventCustom("closeRank", true));

        this.node.removeFromParent(true);
    },

    showUserInfo: function (event) {
        var param = event.getUserData();

        var find = cc.instantiate(this.friend);
        find.parent = this.node;
        find.getComponent("LyFriendInfo").init(param.data, param.isFollow);

        event.stopPropagation();
    },

    createImage(avatarUrl) {
        if (CC_WECHATGAME) {
            try {
                let image = wx.createImage();
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        console.log(e);
                        this.avatarImgSprite.node.active = false;
                    }
                };
                image.src = avatarUrl;
            } catch (e) {
                console.log(e);
                this.avatarImgSprite.node.active = false;
            }
        } else {
            cc.loader.load({
                url: avatarUrl, type: 'jpg'
            }, (err, texture) => {
                this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
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
});
