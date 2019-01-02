var com = require('common');

cc.Class({
    extends: cc.Component,

    properties: {
        spinBtn: cc.Button,
        m_bgm: {
            default: null,
            url: cc.AudioClip
        }
    },

    onLoad () {
        this.com = require('common');
        this.node_anim = this.node.runAction(cc.sequence(
            cc.scaleTo(0.05, 1.1),
            cc.scaleTo(0.2, 1.0)
        ));
        var btn_sure = this.node.getChildByName("btn_sure");
        btn_sure.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_mianfeihuode"]);
    },

    init (show_dlg_array, key, unlockAD) {
        var itemId = show_dlg_array[key];
        this._show_dlg_array = show_dlg_array;
        this._key = key;
        this._unlockAD = unlockAD;

        var des = null;
        var item = this.com.getDishesByID(itemId);
        if (item){
            des = item.des;
        }
        var name_left = this.node.getChildByName("name");
        name_left.getComponent(cc.RichText).string = "<color=#9C651F><b>" + item.name + "</b></color>";
        var spItem_left = this.node.getChildByName("spItem");
        spItem_left.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_" + itemId + "_s"]);
        var desc_left = this.node.getChildByName("desc");
        this.showDesc(desc_left.getComponent(cc.RichText), des);
    },

    showDesc: function(label, str){
        var line_count = 10;
        var str_new = "";
        var len = str.length;
        var start = 0;
        while (len > 0){
            str_new += str.substr(start, line_count);
            len -= line_count;
            start += line_count;
            if (len > 0) str_new += '\r\n';
        }

        label.string = "<color=#9C651F><b>" + str_new + "</b></color>";
    },

    btnClose: function(event, coustEvent) {
        // if (CC_WECHATGAME && !this._isViewVedio && this._unlockAD) {
        //     this.com.dlgScript = this;
        //     this.spinBtn.interactable = false;

        //     if(!this._videoAd){
        //         this._videoAd = wx.createRewardedVideoAd({ adUnitId: 'adunit-8daba22adfefa58f' });
        //     }
        //     this._videoAd.onClose(this.vedioPlayOver1);
        //     var music = cc.sys.localStorage.getItem("CloseMusic");
        //     if(music == 1){
        //         cc.audioEngine.stopAll();; //停止背景音乐
        //     }
        //     this._videoAd.load().then(() => this._videoAd.show()).catch(err => console.log(err.errMsg));
        // } else {
            this.afterVedioBegin();
        // }
    },
    
    afterVedioBegin: function(){
        this._isViewVedio = false;

        this.node.dispatchEvent(new cc.Event.EventCustom("resumeGame", true));

        if(this.node_anim) this.node.stopAction(this.node_anim);
        if(this._key < this._show_dlg_array.length-1){
            var evt = new cc.Event.EventCustom("show_dlg", true);
            evt.setUserData({
                show_dlg_array: this._show_dlg_array,
                key: this._key + 1
            });
            this.node.dispatchEvent(evt);
        }
        this.node.removeFromParent(true);
    },

//     vedioPlayOver1: function(res){
//         let this_ = com.dlgScript;
//         // 用户点击了【关闭广告】按钮
//         // 小于 2.1.0 的基础库版本，res 是一个 undefined
//         if (res && res.isEnded || res === undefined) {
//             // 正常播放结束，可以下发游戏奖励
//             // wx.aldSendEvent('游戏视频成功',{});

//             if (CC_WECHATGAME) wx.aldSendEvent('解锁食物-看激励广告', {});
//             this_._isViewVedio = true;

//             this_.afterVedioBegin();
//         }
//         else {
//             // 播放中途退出，不下发游戏奖励
//             console.log('游戏视频失败');
//             // wx.aldSendEvent('游戏视频失败',{});
//         }
//         var music = cc.sys.localStorage.getItem("CloseMusic");
//         if(music == 1){
//             cc.audioEngine.playMusic(this_.m_bgm, true);
//         }

//         this_._videoAd.offClose(this_.vedioPlayOver1);
//         this_.spinBtn.interactable = true;
//     },

    // onDestory:function(){
    //     if(this._videoAd){
    //         this._videoAd.offClose(this.vedioPlayOver1);
    //     }
    // },
});
