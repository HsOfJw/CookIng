let JsonFileCfg = require('JsonFileCfg');
module.exports = {

    getAchiveDat() {
        let rankLevelData = JsonFileCfg.file.rankLevel.data.data;
        for (let i = 0; i < rankLevelData.length; i++) {
            let stageLevelId = rankLevelData[i]["ID"];
            if (stageLevelId == id) {
                return rankLevelData[i];
            }
        }
        return null;
    },


    //获取当前段位 下 南瓜下落的速度
    getCurrentLevelDropSpeed(level) {
        let dropSpeedData = JsonFileCfg.file.dropSpeed.data.data;
        for (let i = 0; i < dropSpeedData.length; i++) {
            let rankLevel = dropSpeedData[i]["Rank"];
            if (rankLevel === level.toString()) {
                return dropSpeedData[i];
            }
        }
        return null;
    },
    //获取跳转游戏的参数信息
    getDirectGameParam(id) {
        let directGameData = JsonFileCfg.file.directGame.data.data;
        for (let i = 0; i < directGameData.length; i++) {
            let gameParamId = directGameData[i]["id"];
            if (gameParamId === id) {
                return directGameData[i];
            }
        }
        return null;
    },
};
