// 配置 Json 文件必须放在resources/json 目录下
module.exports = {
    _loadJson: function (file, obj) {
        //let url = cc.url.raw("resources/json/" + file + ".json");
        cc.loader.loadRes("json/" + file,
            function (err, results) {
                // 完成
                if (err) {
                    console.log("解析配置文件" + file + "失败: " + err);
                } else {
                    if (results) {
                        obj['data'] = results.json;
                    } else {
                        console.log("json文件加载报错", file);
                    }
                }
            }.bind(this));
    },

    file: {
        achive: {data: [], name: "achive"},
        custom: {data: [], name: "custom"},
        dialog: {data: [], name: "dialog"},
        dishes: {data: [], name: "dishes"},
        event: {data: [], name: "event"},
        fluctuate: {data: [], name: "fluctuate"},
        foodNumRate: {data: [], name: "foodNumRate"},
        food: {data: [], name: "food"},
        guide: {data: [], name: "guide"},
        monthScore: {data: [], name: "monthScore"},
        month: {data: [], name: "month"},
        newScore: {data: [], name: "newScore"},
        otherGame: {data: [], name: "otherGame"},
        param: {data: [], name: "param"},
        policy: {data: [], name: "policy"},
        task: {data: [], name: "task"},
        turntable: {data: [], name: "turntable"},
        workbench: {data: [], name: "workbench"},
    },
    _isInit: false,
    initJson: function (cb) {
        if (this._isInit === false) {
            this._isInit = true;
            //加载json 文件
            for (let key in this.file) {
                this._loadJson(key, this.file[key]["data"]);
            }
        } else {
            console.log("[JsonFileMgr] has init");
        }
    },
}