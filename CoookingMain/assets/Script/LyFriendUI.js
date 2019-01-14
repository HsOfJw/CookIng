cc.Class({
    extends: cc.Component,

    properties: {
        lbTimes: cc.Label
    },

    onLoad () {
        this.com = require('common');
        this.httpUtils = require("httpUtils");

        var ditu = this.node.getChildByName("ditu");
        ditu.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_kandian_ditu"]);
        
        var gou = this.node.getChildByName("gou");
        gou.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_kandian_gou"]);
        
        var guanzhu = this.node.getChildByName("guanzhu");
        guanzhu.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shejiao_kandian_guanzhu"]);
        
        var fanhui = this.node.getChildByName("fanhui");
        fanhui.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shengji_fanhui"]);

        this.init();
    },

    start () {

    },

    init: function(){
        this._continue = false;
        this._times = 0;
        this._isFollow = true;

        var this_ = this;

        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId,
        };
        var token = cc.sys.localStorage.getItem("Token");
        var url = this.com.serverUrl + "/user/getVisit";
        this.httpUtils._instance.httpPost(url, JSON.stringify(params), function(data){
            var jsonD = JSON.parse(data);
            if (jsonD["errcode"] === 0){
                this_._times = jsonD.data;
                if (jsonD.data < 3){
                    this_.lbTimes.string = jsonD.data + "/3"
                } else {
                    this_.lbTimes.string = "3/3";
                }
            } else {
                this_._times = 3;
                this_.lbTimes.string = "3/3";
            }

            this_.getVisit();
        }, token);
    },

    getVisit: function(){
        var this_ = this;
        this_._already = false;

        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId,
            otherId: this.com.friendId,
        };
        var token = cc.sys.localStorage.getItem("Token");
        var url = this.com.serverUrl + "/user/getVisitTimes";
        this.httpUtils._instance.httpPost(url, JSON.stringify(params), function(data){
            var jsonD = JSON.parse(data);
            var bangtakandian = this_.node.getChildByName("bangtakandian");

            if (jsonD["errcode"] === 0){
                if (this_._times < 3){
                    if (jsonD.data > 0){
                        bangtakandian.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this_.com.res_loaded["png_shejiao_yibangtakandian"]);
                        this_._already = true;
                    } else {
                        bangtakandian.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this_.com.res_loaded["png_shejiao_bangtakandian"]);
                    }
                }
            } else {
                console.log(jsonD.msg);
            }

            //this_.findUser();
            this_._continue = true;
        }, token);
    },

    // findUser: function(){
    //     var this_ = this;

    //     var usrId = cc.sys.localStorage.getItem("usrId");
    //     var params = {
    //         gameType: this_.com.project_name,
    //         usrId: usrId,
    //         friendId: this.com.friendId,
    //     };
    //     var token = cc.sys.localStorage.getItem("Token");
    //     var url = this.com.serverUrl + "/user/findUser";
    //     this.httpUtils._instance.httpPost(url, JSON.stringify(params), function(data){
    //         var jsonD = JSON.parse(data);
    //         var gou = this_.node.getChildByName("gou");

    //         if (jsonD["errcode"] === 0){
    //             if (jsonD.data.isFollow != null){
    //                 gou.active = true;
    //             } else {
    //                 gou.active = false;
    //             }
    //         } else {
    //             gou.active = true;
    //         }

    //         this_._continue = true;
    //     }, token);
    // },

    btnReturn: function(event, customData){
        if (!this._continue) return;

        this.com.isSave = true;
        var usrId = cc.sys.localStorage.getItem("usrId");
        this.com.initUserDataFromServer(usrId);
    },

    btnHelp: function(event, customData){
        console.log(this._times);
        if (!this._continue) return;
        if (this._times >= 3) return;
        if (this._already) return;

        if (this._isFollow){
            var usrId = cc.sys.localStorage.getItem("usrId");
            var params = {
                usrId: usrId,
                followId: this.com.friendId
            };
            var token = cc.sys.localStorage.getItem("Token");
            var url = this.com.serverUrl + "/user/follow";
            this.httpUtils._instance.httpPost(url, JSON.stringify(params), function(data){
                var jsonD = JSON.parse(data);

                if (jsonD["errcode"] === 0){
                    console.log("关注成功")
                } else {
                    console.log(jsonD.msg)
                }
            }, token);
        }

        this.node.dispatchEvent(new cc.Event.EventCustom("helpFriend", true));
        this.node.removeFromParent(true);
    },

    btnFollow: function(event, customData){
        var gou = this.node.getChildByName("gou");
        if (!this._isFollow){
            gou.active = true;
            this._isFollow = true;
        } else {
            gou.active = false;
            this._isFollow = false;
        }
    },

    // update (dt) {},
});
