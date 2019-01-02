cc.Class({
    extends: cc.Component,

    properties: {
        prefabRankView: cc.Prefab,
    },

    start() {
        if (CC_WECHATGAME) {
            window.wx.onMessage(data => {
                //this.removeChild();
                cc.log("接收主域发来消息：", data)
                if (data.messageType == 0) {
                    this.fetchFriendData(data.MAIN_MENU_NUM, data.type, false);
                } else if (data.messageType == 1) {
                    this.submitScore(data.MAIN_MENU_NUM, data.data);
                } else if (data.messageType == 2){
                    this.fetchFriendData(data.MAIN_MENU_NUM, data.type, true, data.shareTickets);
                }
            });
        }
    },

    submitScore(MAIN_MENU_NUM, data) { //提交得分
        if (CC_WECHATGAME) {
            window.wx.getUserCloudStorage({
                // 以key/value形式存储
                keyList: [MAIN_MENU_NUM],
                success: function (getres) {
                    console.log('getUserCloudStorage', 'success', getres)
                    if (getres.KVDataList.length != 0) {
                        var val = JSON.parse(getres.KVDataList[0].value);
                        if (val.score > data.score) {
                            return;
                        }
                    }
                    // 对用户托管数据进行写数据操作
                    window.wx.setUserCloudStorage({
                        KVDataList: [{key: MAIN_MENU_NUM, value: JSON.stringify(data)}],
                        success: function (res) {
                            console.log('setUserCloudStorage', 'success', res)
                        },
                        fail: function (res) {
                            console.log('setUserCloudStorage', 'fail')
                        },
                        complete: function (res) {
                            console.log('setUserCloudStorage', 'ok')
                        }
                    });
                },
                fail: function (res) {
                    console.log('getUserCloudStorage', 'fail')
                },
                complete: function (res) {
                    console.log('getUserCloudStorage', 'ok')
                }
            });
        } else {
            cc.log("提交得分:" + MAIN_MENU_NUM + " : " + data.score)
        }
    },

    removeChild() {
        this.node.removeChildByTag(1000);
    },

    fetchFriendData(MAIN_MENU_NUM, type, isQun, shareTickets) {
        this.node.removeAllChildren();
        if (CC_WECHATGAME) {
            let view = cc.instantiate(this.prefabRankView);
            view.getComponent('RankView').init(MAIN_MENU_NUM, type, isQun, shareTickets);
            this.node.addChild(view,1,1000);
        }
    },
});
