cc.Class({
    extends: cc.Component,

    properties: {
        rankingScrollView: cc.ScrollView,
        scrollViewContent: cc.Node,
        loadingLabel: cc.Node,//加载文字
        prefabRankItem: cc.Prefab,
        prefabMineItem: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    init: function (key, type, isQun, shareTickets) {
        this.rankingScrollView.node.active = true;
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            success: (userRes) => {
                this.loadingLabel.active = false;
                console.log('success', userRes.data)
                let userData = userRes.data[0];

                if (isQun) {
                    wx.getGroupCloudStorage({
                        shareTicket: shareTickets,
                        keyList: [key],
                        success: res => {
                            console.log("wx.getGroupCloudStorage success", res);
                            let data = res.data;
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }

                                if(typeof(JSON.parse(a.KVDataList[0].value)) != "object" ){
                                    return 0;
                                }
                                if(typeof(JSON.parse(b.KVDataList[0].value)) != "object" ){
                                    return 0;
                                }

                                return JSON.parse(b.KVDataList[0].value).score - JSON.parse(a.KVDataList[0].value).score;
                            });
                            for (let i = 0; i < data.length; i++) {
                                var playerInfo = data[i];
                                cc.log("qun", data[i].KVDataList.length)
                                if(data[i].KVDataList.length == 0){
                                    break;
                                }
                                if(typeof(JSON.parse(data[i].KVDataList[0].value)) != "object" ){
                                    break;
                                }
                                var _info = JSON.parse(data[i].KVDataList[0].value);
                                playerInfo["des"] = _info.des;
                                playerInfo["sex"] = _info.sex;

                                var item = cc.instantiate(this.prefabRankItem);
                                item.getComponent('LyRankItem').init(i, playerInfo, type);
                                this.scrollViewContent.addChild(item);
                                if (data[i].avatarUrl == userData.avatarUrl) {
                                    let userItem = cc.instantiate(this.prefabMineItem);
                                    userItem.getComponent('MineItem').init(i, playerInfo);
                                    userItem.y = -354;
                                    this.node.addChild(userItem, 1, 1000);
                                }
                            }
                            if (data.length <= 5) {
                                let layout = this.scrollViewContent.getComponent(cc.Layout);
                                layout.resizeMode = cc.Layout.ResizeMode.NONE;
                            }
                        },
                        fail: res => {
                            console.log("wx.getFriendCloudStorage fail", res);
                            this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                        },
                    });
                } else {
                    //取出所有好友数据
                    wx.getFriendCloudStorage({
                        keyList: [key],
                        success: res => {
                            console.log("wx.getFriendCloudStorage success", res);
                            let data = res.data;
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                if(typeof(JSON.parse(a.KVDataList[0].value)) != "object" ){
                                    return 0
                                }
                                if(typeof(JSON.parse(b.KVDataList[0].value)) != "object" ){
                                    return 0
                                }
                                return JSON.parse(b.KVDataList[0].value).score - JSON.parse(a.KVDataList[0].value).score;
                            });
                            for (let i = 0; i < data.length; i++) {
                                var playerInfo = data[i];
                                cc.log("haoyou", data[i].KVDataList.length)
                                if(data[i].KVDataList.length == 0){
                                    continue;
                                }
                                if(typeof(JSON.parse(data[i].KVDataList[0].value)) != "object" ){
                                    continue;
                                }
                                var _info = JSON.parse(data[i].KVDataList[0].value);
                                playerInfo["des"] = _info.des;
                                playerInfo["sex"] = _info.sex;

                                var item = cc.instantiate(this.prefabRankItem);
                                item.getComponent('LyRankItem').init(i, playerInfo, type);
                                this.scrollViewContent.addChild(item);
                                if (data[i].avatarUrl == userData.avatarUrl) {
                                    let userItem = cc.instantiate(this.prefabMineItem);
                                    userItem.getComponent('MineItem').init(i, playerInfo);
                                    userItem.y = -354;
                                    this.node.addChild(userItem, 1, 1000);
                                }
                            }
                            if (data.length <= 5) {
                                let layout = this.scrollViewContent.getComponent(cc.Layout);
                                layout.resizeMode = cc.Layout.ResizeMode.NONE;
                            }
                        },
                        fail: res => {
                            console.log("wx.getFriendCloudStorage fail", res);
                            this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                        },
                    });
                }
            },
            fail: (res) => {
                this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
            }
        });
    },

    // update (dt) {},
});
