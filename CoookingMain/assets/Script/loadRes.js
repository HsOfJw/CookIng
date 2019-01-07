cc.Class({
    extends: cc.Component,

    properties: {
        m_progress: cc.ProgressBar,
        m_lbTips: cc.Label,
        m_btn_stare: cc.Button,
        m_lab_dialog: cc.Label,
        panel_tip: cc.Node,
        m_bgm: {
            default: null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function () {
        var this_ = this;
        this.com = require('common');
        this.httpUtils = require("httpUtils");
        this.encrypt = require('encryptjs');

        this.start_loading = false;
        this.ber_time = 0;
        this.cur_time = 0;
        this.dif_time = 0;

        //
        this.start_loading_json = false;
        this.cur_time_json = 0;

        cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function () {
            cc.audioEngine.stopAll();
            this_.start_loading = false;

            // this_.com.saveUserData();
            // cc.director.getScheduler().unschedule(this_.com.saveUserData);
            // //cc.game.removePersistRootNode(this_.com._globalNode);
            // if (this_.com._globalNode) this_.com._globalNode.destroy();
        });
        cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function () {
            var music = cc.sys.localStorage.getItem("CloseMusic");
            if (music == 0 || music == null) {
                cc.sys.localStorage.setItem("CloseMusic", 1); //1-开启；2-关闭
                cc.audioEngine.playMusic(this_.m_bgm, true);
            } else if (music == 1) {
                cc.audioEngine.playMusic(this_.m_bgm, true);
            } else if (music == 2) {
                cc.audioEngine.stopMusic();
            }
            cc.loader.clear();
            for (var i = 0; i < 5; i++) {
                this_.loading(this_, i);
            }

            // if (this_.com._globalNode) this_.com._globalNode.destroy();

            // this_.com._globalNode = new cc.Node("MyGlobalNode");
            // cc.game.addPersistRootNode(this_.com._globalNode);

            // var interval = this.saveInterval;
            // var repeat = cc.macro.REPEAT_FOREVER;
            // var delay = 10;
            // var paused = false;
            // cc.director.getScheduler().schedule(this_.com.saveUserData, this_.com._globalNode, interval, repeat, delay, paused);
            // console.log("+++++++++++++++")
        });

        var music = cc.sys.localStorage.getItem("CloseMusic");
        if (music == 0 || music == null) {
            cc.sys.localStorage.setItem("CloseMusic", 1); //1-开启；2-关闭
            cc.audioEngine.playMusic(this_.m_bgm, true);
        } else if (music == 1) {
            cc.audioEngine.playMusic(this_.m_bgm, true);
        } else if (music == 2) {
            cc.audioEngine.stopMusic();
        }

        if (CC_WECHATGAME) wx.aldSendEvent('进入游戏', {});

        if (CC_WECHATGAME) {
            window.wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
            cc.loader.loadRes("texture/share", function (err, data) {
                wx.onShareAppMessage(function (res) {
                    return {
                        title: "抖音上超火的网红游戏",
                        imageUrl: data.url,
                        success(res) {
                            console.log("转发成功!!!")
                            if (CC_WECHATGAME) {
                                // wx.aldSendEvent('登陆页面分享成功',{});
                            }
                            this_.com.setAchive(7, this_.node);
                        },
                        fail(res) {
                            console.log("转发失败!!!")
                            if (CC_WECHATGAME) {
                                // wx.aldSendEvent('登陆页面分享失败',{});
                            }
                        }
                    }
                })
            });
        }

        this.loadCfg(this);
    },

    load_dialog(this_) {
        console.log("进入到load_dialog方法中");
        this_.dialog_anim = null;
        for (var i = 0; i < this_.com.res_cfg.length; i++) {
            if (this_.com.res_cfg[i].filename == "dialog") {
                cc.loader.load({
                    url: this_.com.serverUrl_res + this_.com.res_cfg[i].filepath,
                    type: this_.com.res_cfg[i].filetype
                }, function (err, data) {
                    this_.dialog_anim = this_.m_lab_dialog.node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function () {
                        var random = Math.floor(cc.random0To1() * data.length) + 5001;
                        for (var j = 0; j < data.length; j++) {
                            if (data[j].id == random) {
                                this_.m_lab_dialog.string = data[j].dialog;
                            }
                        }
                    }), cc.delayTime(3))));
                });
            }
        }
    },

    load_res(this_) {
        console.log("进入到load_res方法中");
        for (var i = 0; i < this_.com.res_cfg.length; i++) {
            if (this_.com.res_cfg[i].filename == "loading_ditu") {
                cc.loader.load({
                    url: this_.com.serverUrl_res + this_.com.res_cfg[i].filepath,
                    type: this_.com.res_cfg[i].filetype
                }, function (err, spriteFrame) {
                    var background = cc.find("background", this_.node);
                    background.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spriteFrame);
                });
            }
            if (this_.com.res_cfg[i].filename == "loading_jindutiao_di") {
                cc.loader.load({
                    url: this_.com.serverUrl_res + this_.com.res_cfg[i].filepath,
                    type: this_.com.res_cfg[i].filetype
                }, function (err, spriteFrame) {
                    this_.m_progress.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spriteFrame);
                });
            }
            if (this_.com.res_cfg[i].filename == "loading_jindutiao") {
                cc.loader.load({
                    url: this_.com.serverUrl_res + this_.com.res_cfg[i].filepath,
                    type: this_.com.res_cfg[i].filetype
                }, function (err, spriteFrame) {
                    var bar = cc.find("bar", this_.m_progress.node);
                    bar.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spriteFrame);
                });
            }
            if (this_.com.res_cfg[i].filename == "loading_kaishiyouxi") {
                cc.loader.load({
                    url: this_.com.serverUrl_res + this_.com.res_cfg[i].filepath,
                    type: this_.com.res_cfg[i].filetype
                }, function (err, spriteFrame) {
                    var btn_stare = cc.find("btn_stare", this_.node);
                    btn_stare.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spriteFrame);
                });
            }


            if (this_.com.res_cfg[i].filename == "dlg_sure") {
                cc.loader.load({
                    url: this_.com.serverUrl_res + this_.com.res_cfg[i].filepath,
                    type: this_.com.res_cfg[i].filetype
                }, function (err, spriteFrame) {
                    var btn_sure = cc.find("btn_sure", this_.panel_tip);
                    btn_sure.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spriteFrame);
                });
            }

        }
    },

    auth: function () {
        if (!CC_WECHATGAME) {
            //这里仅浏览器快速测试用
            cc.sys.localStorage.setItem("usrId", 4020);
            this.getToken(this);
            return;
        }
        let this_ = this;
        var token = cc.sys.localStorage.getItem("Token");
        console.log("token=" + token);
        if (token == null || token == "") {
            this.login(this);
            return;
        }
        var url = this_.com.serverUrl + "/authCheck";
        this_.httpUtils._instance.httpGets(url, function (data) {
            console.log("auth", data);
            var jsonD = JSON.parse(data);
            if (jsonD["errcode"] === 0) {
                this_.route(this_);
                //this_.rankFans(this_);
            } else {
                cc.sys.localStorage.removeItem("Token");
                this_.login(this_);
            }

        }, token);
    },

    login: function (this_) {
        wx.login({
            success: function (res) {
                console.log(res);

                var params = {
                    code: res.code,
                    gameType: this_.com.project_name
                };
                var url = this_.com.serverUrl + "/login/login";
                this_.httpUtils._instance.httpPost(url, JSON.stringify(params), function (data) {
                    console.log(data);
                    var jsonD = JSON.parse(data);
                    if (jsonD["errcode"] === 0) {
                        cc.sys.localStorage.setItem("usrId", jsonD.data.id);
                        cc.sys.localStorage.setItem("openId", jsonD.data.openid);

                        this_.getToken(this_);
                    } else {
                        console.log("登陆失败")
                        wx.showModal({
                            title: "登陆失败",
                            content: "请检查您的网络设置",
                            showCancel: false
                        });
                    }
                });
            }
        });
    },

    getToken: function (this_) {
        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId
        };
        var url = this_.com.serverUrl + "/login/getToken";
        this_.httpUtils._instance.httpPost(url, JSON.stringify(params), function (data) {
            console.log(data);
            var jsonD = JSON.parse(data);
            if (jsonD["errcode"] === 0) {
                cc.sys.localStorage.setItem("Token", jsonD["data"]);
                if (CC_WECHATGAME) {
                    this_.upDataNick(this_);
                    //this_.rankFans(this_);
                }
            } else {
                wx.showToast({title: "获取Token失败"});
            }
        });
    },

    upDataNick: function (this_) {
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        success: function (res) {
                            console.log("userInfo", res.userInfo);
                            var usrId = cc.sys.localStorage.getItem("usrId");
                            var params = {
                                usrId: usrId,
                                avatarUrl: res.userInfo.avatarUrl,
                                nickName: res.userInfo.nickName,
                                sex: res.userInfo.gender
                            };
                            cc.sys.localStorage.setItem("avatarUrl", res.userInfo.avatarUrl);
                            var token = cc.sys.localStorage.getItem("Token");
                            var url = this_.com.serverUrl + "/login/avatarUrl";
                            this_.httpUtils._instance.httpPost(url, JSON.stringify(params), function (data) {
                                console.log(data);
                                var jsonD = JSON.parse(data);

                                if (jsonD["errcode"] === 0) {
                                    console.log(jsonD.msg)

                                    this_.route(this_);
                                } else {
                                    wx.showToast({title: "上传头像失败"});
                                }
                            }, token);
                        }
                    });
                } else {
                    console.log("还没有授权");
                    wx.showToast({title: "没有授权！"});
                }
            }
        });
    },

    rankFans: function (this_) {
        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            gameType: this_.com.project_name,
            usrId: usrId,
            friendId: usrId
        };
        var token = cc.sys.localStorage.getItem("Token");
        var url = this_.com.serverUrl + "/user/findUser";
        this_.httpUtils._instance.httpPost(url, JSON.stringify(params), function (data) {
            var jsonD = JSON.parse(data);
            if (jsonD["errcode"] === 0) {
                if (CC_WECHATGAME) {
                    window.wx.postMessage({
                        messageType: 1,
                        MAIN_MENU_NUM: "Cooking_fans",
                        data: {
                            des: jsonD.data.data.des,
                            sex: jsonD.data.data.sex,
                            score: jsonD.data.data.fans
                        }
                    });
                    console.log("Cooking_fans=" + jsonD.data.data.fans);
                    cc.sys.localStorage.setItem("mySex", jsonD.data.data.sex);
                    cc.sys.localStorage.setItem("myDes", jsonD.data.data.des);
                }
            } else {
                console.log(jsonD.msg)
                wx.showToast({title: "登录失败，请重新登录！"});
            }
        }, token);
    },

    route: function (this_) {
        if (CC_WECHATGAME) wx.hideLoading();
        this_.btnAuthorize.destroy();
        this_.com.initCom();
        if (this_.authorizeLy) {
            this_.authorizeLy.x = 10000;
            this_.authorizeLy.removeFromParent(true);
            this_.authorizeLy = null;
        }
        var usrId = cc.sys.localStorage.getItem("usrId");

        var options = wx.getLaunchOptionsSync();
        if (options.query && options.query.key) {
            if (usrId != options.query.key) {
                console.log(options.query.key);

                var params = {
                    usrId: usrId,
                    usrId_shared: options.query.key
                };
                var token = cc.sys.localStorage.getItem("Token");
                var url = this_.com.serverUrl + "/user/upLoginShareCooking";
                this_.httpUtils._instance.httpPost(url, JSON.stringify(params), function (data) {
                    var jsonD = JSON.parse(data);
                    console.log(jsonD.msg);
                }, token);
            } else {
                console.log("自己点击了自己的分享");
            }
        }

        if (CC_WECHATGAME) wx.aldSendEvent('开始游戏', {});

        this_.com.initUserDataFromServer(usrId);
    },

    loadCfg: function (this_) {
        this_.cur_time_json = new Date().getTime();
        this_.start_loading_json = true;
        if (CC_WECHATGAME) {
            wx.request({
                url: this_.com.serverUrl_res + this_.com.project_name + '/Cfg.json',
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success(res) {
                    this_.cbLoadCfg(this_, res.data);
                }
            })
        } else if (!cc.sys.isBrowser) {
            console.log("游戏进入到 OPPO真机中");
            this.httpUtils._instance.httpGets(this_.com.serverUrl_res + this_.com.project_name + '/Cfg.json', function (res) {
                console.log("使用原生请求", "errCode", res.statusCode, "errMsg=", res.data ,"length=",res.data.length);
                //this_.cbLoadCfg(this_, res);
            });
            /* let tempFilePath = qg.env.USER_DATA_PATH + "/cfg.json";
             qg.downloadFile({
                 url: this_.com.serverUrl_res + this_.com.project_name + '/Cfg.json',
                 header: {
                     'content-type': 'application/json'
                 },
                 filePath: tempFilePath,
                 success(msg) {
                     //下载
                     cc.loader.load(tempFilePath, function (err, jsonData) {
                         this_.cbLoadCfg(this_, jsonData);
                     });
                 },
                 fail(msg) {
                     // 下载失败
                     console.log("downloadFile cfg.json失败", msg);
                 },
             })*/
        } else {
            cc.loader.load({
                url: this_.com.serverUrl_res + this_.com.project_name + '/Cfg.json',
                type: 'json'
            }, function (err, jsonData) {
                this_.cbLoadCfg(this_, jsonData);
            });
        }
    },

    cbLoadCfg: function (this_, jsonData) {
        console.log("jsonData.length =", jsonData.length);
        this_.com.res_cfg = jsonData;
        if (this_.com.res_cfg.length > 0) {
            this_.start_loading_json = false;
            //this_.load_dialog(this_);
            this_.load_res(this_);

            for (let i = 0; i < 5; i++) {
                this_.loading(this_, i);
            }
        }
    },

    re_loading() {
        this.panel_tip.active = false;
        cc.loader.clear();
        for (var i = 0; i < 5; i++) {
            this.loading(this, i);
        }
    },

    loading: function (this_, index) {
        this_.start_loading = true;
        this_.cur_time = new Date().getTime();
        this_.curIndex = index;
        let fileType = this_.com.res_cfg[index].filetype;
        if (fileType === "json") {//plist
            console.log("filepath", this_.com.res_cfg[index].filepath);
            //使用OPPO真机加载json文件
            let tempFilePath = qg.env.USER_DATA_PATH + this_.com.res_cfg[index].filepath;
            qg.downloadFile({
                url: this_.com.serverUrl_res + this_.com.res_cfg[index].filepath,
                header: {
                    'content-type': 'application/json'
                },
                filePath: tempFilePath,
                success(msg) {
                    //下载
                    cc.loader.load(tempFilePath, function (err, data) {
                        if (err) {
                            console.log("  qg.downloadFile  报错", err, data, this_.com.serverUrl_res + this_.com.res_cfg[index].filepath);
                        } else {
                            this_.cur_time = new Date().getTime();
                            var key = this_.com.res_cfg[index].filetype + "_" + this_.com.res_cfg[index].filename;
                            this_.com.res_loaded[key] = data;

                            if (this_.start_loading) {
                                if (this_.curIndex + 1 < this_.com.res_cfg.length) {
                                    //console.log("程序即将进入到loading方法中");
                                    this_.loading(this_, this_.curIndex + 1);
                                    var rate = this_.curIndex / this_.com.res_cfg.length;
                                    this_.m_progress.getComponent(cc.ProgressBar).progress = rate;
                                    this_.m_lbTips.string = Math.floor(rate * 100) + "%";
                                } else {
                                    var arr = Object.keys(this_.com.res_loaded);
                                    console.log(arr.length + "------" + this_.com.res_cfg.length);
                                    if (arr.length < 571) {
                                        cc.loader.clear();
                                        for (var i = 0; i < 5; i++) {
                                            this_.loading(this_, i);
                                        }
                                        return;
                                    }

                                    this_.start_loading = false;
                                    this_.m_progress.node.active = false;
                                    this_.m_btn_stare.node.active = true;
                                    if (CC_WECHATGAME) {
                                        this_.createAuthorizeBtn(this_.m_btn_stare.node);
                                    } else {
                                        this_.m_btn_stare.node.on(cc.Node.EventType.TOUCH_END, function () {
                                            //这里仅浏览器快速测试用
                                            cc.sys.localStorage.setItem("usrId", 4020);
                                            this.getToken(this);
                                            this.com.initCom();
                                            var usrId = cc.sys.localStorage.getItem("usrId");
                                            this_.com.initUserDataFromServer(usrId);
                                        }, this_);
                                    }
                                }
                            }
                        }
                    });
                },
                fail(msg) {
                    // 下载失败
                    console.log("路径信息为", tempFilePath);
                    console.log("qg.downloadFile失败", "errCode=", msg.errCode, "errMsg=", msg.errMsg, this_.com.res_cfg[index].filepath);
                },
            })


            //加载json
            //cc.loader.load(this_.com.serverUrl_res + this_.com.res_cfg[index].filepath, function (err, data) {

            // })
        } /*else if (fileType === "plist") {

        } */ else if (fileType !== "plist") {
            cc.loader.load(this_.com.serverUrl_res + this_.com.res_cfg[index].filepath,
                function (err, data) {
                    if (err) {
                        console.log("loading方法中  cc.loader.load 的文件类型为", this_.com.res_cfg[index].filetype);
                        console.log(" loading方法中 下载 报错", err, data, this_.com.serverUrl_res + this_.com.res_cfg[index].filepath);
                        console.log("---------->");
                    } else {
                        //console.log(" loading方法中  程序没有报错");
                        this_.cur_time = new Date().getTime();
                        var key = this_.com.res_cfg[index].filetype + "_" + this_.com.res_cfg[index].filename;
                        this_.com.res_loaded[key] = data;

                        if (this_.start_loading) {
                            if (this_.curIndex + 1 < this_.com.res_cfg.length) {
                                //console.log("程序即将进入到loading方法中");
                                this_.loading(this_, this_.curIndex + 1);
                                var rate = this_.curIndex / this_.com.res_cfg.length;
                                this_.m_progress.getComponent(cc.ProgressBar).progress = rate;
                                this_.m_lbTips.string = Math.floor(rate * 100) + "%";

                            } else {
                                var arr = Object.keys(this_.com.res_loaded);
                                console.log(arr.length + "------" + this_.com.res_cfg.length);
                                if (arr.length < 571) {
                                    cc.loader.clear();
                                    for (var i = 0; i < 5; i++) {
                                        this_.loading(this_, i);
                                    }
                                    return;
                                }

                                this_.start_loading = false;
                                this_.m_progress.node.active = false;
                                this_.m_btn_stare.node.active = true;
                                if (CC_WECHATGAME) {
                                    this_.createAuthorizeBtn(this_.m_btn_stare.node);
                                } else {
                                    this_.m_btn_stare.node.on(cc.Node.EventType.TOUCH_END, function () {
                                        //这里仅浏览器快速测试用
                                        cc.sys.localStorage.setItem("usrId", 4020);
                                        this.getToken(this);
                                        this.com.initCom();
                                        var usrId = cc.sys.localStorage.getItem("usrId");
                                        this_.com.initUserDataFromServer(usrId);
                                    }, this_);
                                }
                            }
                        }
                    }
                });
        }

    },


    createAuthorizeBtn(btnNode) {
        let frameSize = cc.view.getFrameSize();
        let winSize = cc.director.getWinSize();
        let btnSize = cc.size(btnNode.width + 10, btnNode.height + 10);
        //适配不同机型来创建微信授权按钮
        let left = (winSize.width * 0.5 + btnNode.x - btnSize.width * 0.5) / winSize.width * frameSize.width;
        let top = (winSize.height * 0.5 - btnNode.y - btnSize.height * 0.5) / winSize.height * frameSize.height;
        let width = btnSize.width / winSize.width * frameSize.width;
        let height = btnSize.height / winSize.height * frameSize.height;

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
            console.log("onTap uinfo: ", uinfo);
            if (uinfo.userInfo) {
                console.log("wxLogin auth success");

                wx.showToast({title: "授权成功"});

                wx.showLoading({
                    title: '正在登陆...'
                });
                self.auth();

            } else {
                console.log("wxLogin auth fail");

                wx.showToast({title: "授权失败"});
            }

        });
    }
    ,

    update(dt) {
        if (this.start_loading) {
            this.ber_time = new Date().getTime();
            if (this.cur_time != 0) {
                this.dif_time = this.ber_time - this.cur_time;
                if (this.dif_time > 10000) {
                    this.cur_time = 0;
                    this.start_loading = false;
                    this.panel_tip.active = true;
                }
            }
        }

        if (this.start_loading_json) {
            if (this.cur_time_json != 0) {
                var ber_time = new Date().getTime();
                var dif_time = ber_time - this.cur_time_json;
                if (dif_time > 10000) {
                    this.start_loading_json = false;
                    this.loadCfg(this)
                }
            }
        }
    }
});
