let JsonFileCfg = require("JsonFileCfg");

function initCom() {
    //重构


    /* this.cfgFluctuate = this.res_loaded["json_fluctuate"];
     this.cfgFood = this.res_loaded["json_food"];
     this.cfgDishes = this.res_loaded["json_dishes"];
     this.cfgFoodNumRate = this.res_loaded["json_foodNumRate"];
     this.cfgWorkbench = this.res_loaded["json_workbench"];
     this.cfgPolicy = this.res_loaded["json_policy"];
     this.cfgMonthScore = this.res_loaded["json_monthScore"];
     this.cfgMonth = this.res_loaded["json_month"];
     this.cfgEvent = this.res_loaded["json_event"];
     this.cfgParam = this.res_loaded["json_param"];
     this.cfgCustom = this.res_loaded["json_custom"];
     this.cfgAchive = this.res_loaded["json_achive"];
     this.cfgTurntable = this.res_loaded["json_turntable"];
     this.cfgOtherGame = this.res_loaded["json_otherGame"];
     this.cfgGuide = this.res_loaded["json_guide"];
     this.cfgNewScore = this.res_loaded["json_newScore"];
     this.cfgTask = this.res_loaded["json_task"];*/
    this.cfgFluctuate = JsonFileCfg.file.fluctuate.data.data;
    this.cfgFood = JsonFileCfg.file.food.data.data;
    this.cfgDishes = JsonFileCfg.file.dishes.data.data;
    this.cfgFoodNumRate = JsonFileCfg.file.foodNumRate.data.data;
    this.cfgWorkbench = JsonFileCfg.file.workbench.data.data;
    this.cfgPolicy = JsonFileCfg.file.policy.data.data;
    this.cfgMonthScore = JsonFileCfg.file.monthScore.data.data;
    this.cfgMonth = JsonFileCfg.file.month.data.data;
    this.cfgEvent = JsonFileCfg.file.event.data.data;
    this.cfgParam = JsonFileCfg.file.param.data.data;
    this.cfgCustom = JsonFileCfg.file.custom.data.data;
    this.cfgAchive = JsonFileCfg.file.achive.data.data;
    this.cfgTurntable = JsonFileCfg.file.turntable.data.data;
    this.cfgOtherGame = JsonFileCfg.file.otherGame.data.data;
    this.cfgGuide = JsonFileCfg.file.guide.data.data;
    this.cfgNewScore = JsonFileCfg.file.newScore.data.data;
    this.cfgTask = JsonFileCfg.file.task.data.data;

    console.log("this.cfgParam=", this.cfgParam);

    this.saveData.gold = this.getParam(1008).param;

    var self = this;
    cc.game.on(cc.game.EVENT_HIDE, function () {
        self.saveUserData();
        cc.director.getScheduler().unschedule(self.saveUserData);
        //cc.game.removePersistRootNode(self._globalNode);
        if (self._globalNode) self._globalNode.destroy();
    });
    cc.game.on(cc.game.EVENT_SHOW, function () {
        if (self._globalNode) self._globalNode.destroy();

        self._globalNode = new cc.Node("MyGlobalNode");
        cc.game.addPersistRootNode(self._globalNode);

        var interval = this.saveInterval;
        var repeat = cc.macro.REPEAT_FOREVER;
        var delay = 10;
        var paused = false;
        cc.director.getScheduler().schedule(self.saveUserData, self._globalNode, interval, repeat, delay, paused);
    });
}

function initUserDataFromServer(userId) {
    var httpUtils = require("httpUtils");
    var usrId = cc.sys.localStorage.getItem("usrId");
    var params = {
        usrId: usrId,
        otherId: userId
    };
    var token = cc.sys.localStorage.getItem("Token");
    var url = this.serverUrl + "/user/getUserData";
    var self = this;


    //发送http 请求
    console.log("开始发送请求");
    httpUtils._instance.httpPost(url, JSON.stringify(params), function (data) {
        var jsonD = JSON.parse(data);
        if (jsonD["errcode"] === 0) {
            console.log("获取玩家[" + userId + "]数据成功！");

            cc.sys.localStorage.setItem("mySex", jsonD.data.info.sex);
            cc.sys.localStorage.setItem("myDes", jsonD.data.info.des);

            self.saveData = JSON.parse(jsonD["data"].data.jsonData);
            self.friendId = userId;

            if (usrId == userId && self.helpTimes > 0) {
                console.log("11111111111111111");
                var achive = self.copyJsonObj(self.saveData.achive);
                achive[4] += self.helpTimes;
                self.setComData("achive", achive);
                self.helpTimes = 0;
            }

            if (self.saveData.curStore == null) {
                console.log("2222222222222222222222");
                cc.director.loadScene('GameUI');
            } else {
                if (self.saveData.curStore == 1) {
                    console.log("3333333333333333333333333333");
                    cc.director.loadScene('GameUI');//test   GameUI
                } else if (self.saveData.curStore == 2) {
                    console.log("444444444444444444444444444444");
                    cc.director.loadScene('CookingUI');
                }
            }
            if (self.saveData.allStore == null) {
                self.saveData.allStore = 1;
            }
        } else {
            if (userId == usrId) {
                console.log("userId == usrId");
                var month = cc.sys.localStorage.getItem("month");
                if (month) self.saveData.month = Number(month);
                var gold = cc.sys.localStorage.getItem("gold");
                if (gold) self.saveData.gold = Number(gold);
                var diamond = cc.sys.localStorage.getItem("diamond");
                if (diamond) self.saveData.diamond = Number(diamond);
                var praise = cc.sys.localStorage.getItem("praise");
                if (praise) self.saveData.praise = Number(praise);
                var gift = cc.sys.localStorage.getItem("gift");
                if (gift) self.saveData.gift = Number(gift);
                var shopItem = cc.sys.localStorage.getItem("shopItem");
                if (shopItem) self.saveData.shopItem = JSON.parse(shopItem);
                var foods = cc.sys.localStorage.getItem("foods");
                if (foods) self.saveData.foods = JSON.parse(foods);
                var achive = cc.sys.localStorage.getItem("achive");
                if (achive) self.saveData.achive = JSON.parse(achive);
                var achiveHistory = cc.sys.localStorage.getItem("achiveHistory");
                if (achiveHistory) self.saveData.achiveHistory = JSON.parse(achiveHistory);
                var newbie = cc.sys.localStorage.getItem("newbie");
                if (newbie) self.saveData.newbie = Number(newbie);
                var loginShare = cc.sys.localStorage.getItem("loginShare");
                if (loginShare) self.saveData.loginShare = JSON.parse(loginShare);
                var curStore = cc.sys.localStorage.getItem("curStore");
                if (curStore) self.saveData.curStore = Number(curStore);
                var allStore = cc.sys.localStorage.getItem("allStore");
                if (allStore) self.saveData.curStore = Number(allStore);
                var startMonth = cc.sys.localStorage.getItem("startMonth");
                if (startMonth) self.saveData.startMonth = JSON.parse(startMonth);

                if (self.saveData.curStore == null) {
                    console.log("6666666666666666666666666");
                    cc.director.loadScene('GameUI');
                } else {
                    if (self.saveData.curStore == 1) {
                        console.log("777777777777777777777777777777777777");
                        cc.director.loadScene('GameUI');
                        // cc.director.loadScene('test')
                    } else if (self.saveData.curStore == 2) {
                        console.log("888888888888888888888888888888");
                        cc.director.loadScene('CookingUI');
                    }
                }
            } else {
                console.log("jsonD.msg", jsonD.msg)
            }
        }
    }, token);
    console.log("common 请求发送成功", "url=", url, "token", token);
}

function saveUserData() {
    if (!this.isSave)
        return;

    console.log("save user data: " + this.saveData);

    try {
        var httpUtils = require("httpUtils");
        var usrId = cc.sys.localStorage.getItem("usrId");
        var params = {
            usrId: usrId,
            jsonData: JSON.stringify(this.saveData)
        };
        var token = cc.sys.localStorage.getItem("Token");
        var url = this.serverUrl + "/user/saveUserData";
        httpUtils._instance.httpPost(url, JSON.stringify(params), function (data) {
            var jsonD = JSON.parse(data);
            if (jsonD["errcode"] === 0) {
                console.log("保存玩家数据成功！")
            } else {
                console.log(jsonD.msg)
            }
        }, token);
    } catch (e) {
        console.log(e);
    }
}

function getParam(id) {
    for (var i = 0; i < this.cfgParam.length; i++) {
        if (this.cfgParam[i].id == id)
            return this.cfgParam[i];
    }
    return null;
}

function getHumanInfo(id) {
    for (var i = 0; i < this.cfgCustom.length; i++) {
        if (this.cfgCustom[i].id == id)
            return this.cfgCustom[i];
    }
    return null;
}

function getMonthScoreById(id) {
    for (var i = 0; i < this.cfgMonthScore.length; i++) {
        if (this.cfgMonthScore[i].id == id) {
            return this.cfgMonthScore[i];
        }
    }
    return null;
}

function getNewScoreById(id) {
    for (var i = 0; i < this.cfgNewScore.length; i++) {
        if (this.cfgNewScore[i].id == id) {
            return this.cfgNewScore[i];
        }
    }
    return null;
}

function getDurationByID(ID) {
    for (var i = 0; i < this.cfgWorkbench.length; i++) {
        if (this.cfgWorkbench[i].ID == ID) {
            return {
                duration: this.cfgWorkbench[i].duration,
                scorch: this.cfgWorkbench[i].scorch
            };
        }
    }
    return {
        duration: 0,
        scorch: 0
    };
}

function canScorch(ID) {
    for (var i = 0; i < this.cfgWorkbench.length; i++) {
        if (this.cfgWorkbench[i].ID == ID) {
            return this.cfgWorkbench[i].cookerType == 1;
        }
    }
    return false;
}

function getMachineType(ID) {
    for (var i = 0; i < this.cfgWorkbench.length; i++) {
        if (this.cfgWorkbench[i].ID == ID) {
            return this.cfgWorkbench[i].typeID;
        }
    }
    return -1;
}

function getMachineItemByID(ID) {
    for (var i = 0; i < this.cfgWorkbench.length; i++) {
        if (this.cfgWorkbench[i].ID == ID) {
            return this.cfgWorkbench[i];
        }
    }
    return null;
}

function getMaterialsType(material) {
    for (var i = 0; i < this.cfgDishes.length; i++) {
        if (this.cfgDishes[i].ID == material) {
            return this.cfgDishes[i].typeid;
        }
    }
    return -1;
}

function getMaterialsLevel(material) {
    for (var i = 0; i < this.cfgDishes.length; i++) {
        if (this.cfgDishes[i].ID == material) {
            return this.cfgDishes[i].level;
        }
    }
    return -1;
}

function getDishesByID(ID) {
    for (var i = 0; i < this.cfgDishes.length; i++) {
        if (this.cfgDishes[i].ID == ID) {
            return this.cfgDishes[i];
        }
    }
    return null;
}

function getFoodCompose(materials) {
    for (var i = 0; i < this.cfgFood.length; i++) {
        var dishes = this.cfgFood[i];
        var find = [];
        for (var k = 0; k < materials.length; k++) {
            for (var j = 1; j <= 5; j++) {
                if (dishes["food" + j] == this.getMaterialsType(materials[k])) {
                    find.push(j);
                    break;
                }
            }
        }
        if (find.length == materials.length) {
            find.sort();
            var canCompose = true;
            for (var h = 0; h < find.length; h++) {
                if (find[h] != (h + 1)) {
                    canCompose = false;
                    break;
                }
            }
            if (canCompose) return dishes.id;
        }
    }
    return -1;
}

function isSameFoodCompose(materials) {
    for (var i = 0; i < this.cfgFood.length; i++) {
        var dishes = this.cfgFood[i];
        var have = 0;
        for (var j = 1; j <= 5; j++) {
            if (dishes["food" + j]) {
                have++;
            }
        }
        var find = 0;
        var level = -1;
        for (var k = 0; k < materials.length; k++) {
            for (var j = 1; j <= 5; j++) {
                if (dishes["food" + j] == this.getMaterialsType(materials[k])) {
                    if (j == 1) {
                        level = this.getMaterialsLevel(materials[k]);
                    }
                    find++;
                    break;
                }
            }
        }
        if (find == materials.length && find == have) {
            return {
                id: dishes.id,
                lvl: level
            };
        }
    }
    return -1;
}

function getFoodLvl(foodId) {
    var foodType = 0;
    for (var i = 0; i < this.cfgFood.length; i++) {
        if (this.cfgFood[i].id == foodId) {
            foodType = this.cfgFood[i].food1;
            break;
        }
    }
    var dishesId = this.saveData.shopItem[foodType.toString()];
    if (foodType == 0 || dishesId == null) {
        return -1;
    }
    return this.getMaterialsLevel(dishesId);
}

function isSameMaterial(material1, material2) {
    if (material1 == material2) {
        return true;
    }

    var material1_Type = null;
    var material2_Type = null;
    for (var i = 0; i < this.cfgDishes.length; i++) {
        if (material1 == this.cfgDishes[i].ID) {
            material1_Type = this.cfgDishes[i].typeid;
        }
        if (material2 == this.cfgDishes[i].ID) {
            material2_Type = this.cfgDishes[i].typeid;
        }
    }
    if (material1_Type == material2_Type && material1_Type != null) {
        return true;
    }
    return false;
}

function getFluctPeople(fluctuate) {
    for (var i = 0; i < this.cfgFluctuate.length; i++) {
        var fluct = this.cfgFluctuate[i];
        if (fluct.fluctuate == fluctuate) {
            return {
                "maxFluctuatePeople": fluct.people,
                "appearBlanking": fluct.appearTime * 60
            };
        }
    }
    return {
        "maxFluctuatePeople": 0,
        "appearBlanking": 0
    };
}

function getMonthTarget() {
    for (var i = 0; i < this.cfgFoodNumRate.length; i++) {
        if (this.saveData.month == this.cfgFoodNumRate[i].month) {
            if ((Math.random() * 10000) < this.cfgFoodNumRate[i].percent) {
                var id = Math.floor(Math.random() * 5);
                return this.getMTarget(id);
            }
        }
    }
    return this.getMTarget(0);
}

function getMonthEvent(month) {
    for (var i = 0; i < this.cfgMonth.length; i++) {
        if (this.cfgMonth[i].month == month - 1) {
            if (Math.random() > this.cfgMonth[i].per) {
                break;
            }
            var eventIDs = this.cfgMonth[i].eventID.split(",");
            var eventPowers = this.cfgMonth[i].eventPower.split(",");
            var id = this.getPercentage(eventPowers);
            if (id >= 0) {
                return eventIDs[id];
            }
            break;
        }
    }
    return -1;
}

function getEventInfo(evtId) {
    for (var i = 0; i < this.cfgEvent.length; i++) {
        if (this.cfgEvent[i].id == evtId)
            return this.cfgEvent[i];
    }
    return null;
}

function getMTarget(id) {
    for (var j = 0; j < this.cfgPolicy.length; j++) {
        if (this.cfgPolicy[j].ID == id) {
            return this.cfgPolicy[j];
        }
    }
    return null;
}

function getGolds(dishes) {
    var gold = 0;
    for (var i = 0; i < dishes.length; i++) {
        for (var j = 0; j < this.cfgDishes.length; j++) {
            if (this.cfgDishes[j].ID == dishes[i]) {
                gold += this.cfgDishes[j].price;
                break;
            }
        }
    }
    return gold;
}

function getPercentage(weights) {
    var sum = 0;
    for (var i = 0; i < weights.length; i++)
        sum += Number(weights[i]);

    var tmp = 0;
    var val = Math.random() * sum;//cc.random0To1() * sum;
    for (var i = 0; i < weights.length; i++) {
        if (val >= tmp && val < tmp + Number(weights[i])) {
            return i;
        }
        tmp += Number(weights[i]);
    }
    return -1;
}

function getMachineLevel(machineType) {
    for (var key in this.saveData.shopItem) {
        if (key == machineType.toString()) {
            var id = Number(this.saveData.shopItem[key]);
            var item = this.getMachineItemByID(id);
            return item.num;
        }
    }
    return 0;
}

function setComData(key, value) {
    this.saveData[key] = value;
    if (this.isSave) {
        var now = Date.now() / 1000;
        cc.sys.localStorage.setItem(key, JSON.stringify(value));
        if (this.saveTimestamp > 0 && now - this.saveTimestamp > this.saveInterval) {
            this.saveUserData();
        }
        this.saveTimestamp = now;
    }
}

function setAchive(type, node) {
    var achive = this.copyJsonObj(this.saveData.achive);
    if (achive[type] == null || achive[type] == "null")
        achive[type] = 0;
    achive[type]++;
    this.setComData("achive", achive);

    for (var i = 2; i >= 0; i--) {
        for (var j = 0; j < this.cfgAchive.length; j++) {
            if (this.cfgAchive[j].type == type && this.cfgAchive[j].quality == i + 1) {
                var hasGet = false;
                for (var key in this.saveData.achiveHistory) {
                    if (this.saveData.achiveHistory[key] == this.cfgAchive[j].id) {
                        hasGet = true;
                        return false;
                    }
                }
                if (!hasGet && achive[type] == this.cfgAchive[j].num) {
                    var create_node = new cc.Node();
                    create_node.parent = node;
                    create_node.setPosition(cc.v2(0, 200));
                    var bg = new cc.Node();//new cc.Sprite();
                    create_node.addChild(bg, 1, 1000);
                    bg.addComponent(cc.Sprite);
                    bg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.res_loaded["png_tips_bg"]);

                    var lb1 = new cc.Node();//new cc.RichText();
                    create_node.addChild(lb1, 1, 1003);
                    lb1.addComponent(cc.Label);
                    lb1.anchorX = 0;
                    lb1.getComponent(cc.Label).fontSize = 40;
                    lb1.getComponent(cc.Label).string = "完成成就【";
                    lb1.setPosition(cc.v2(-220, 0));

                    var sp = new cc.Node();//new cc.Sprite();
                    create_node.addChild(sp, 1, 1001);
                    sp.addComponent(cc.Sprite);
                    if (i == 2) {
                        sp.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.res_loaded["png_jiangbei_jinpai"]);
                    } else if (i == 1) {
                        sp.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.res_loaded["png_jiangbei_yinpai"]);
                    } else if (i == 0) {
                        sp.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.res_loaded["png_jiagbei_tongpai"]);
                    }
                    sp.setPosition(cc.v2(15, 0));

                    var lb = new cc.Node();//new cc.RichText();
                    create_node.addChild(lb, 1, 1002);
                    lb.addComponent(cc.Label);
                    lb.anchorX = 0;
                    lb.getComponent(cc.Label).fontSize = 40;
                    lb.getComponent(cc.Label).string =  this.cfgAchive[j].name + "】";
                    lb.setPosition(cc.v2(50, 0));

                    create_node.runAction(cc.sequence(
                        cc.delayTime(5),
                        cc.spawn(
                            cc.moveBy(0.2, cc.v2(0, 10)),
                            cc.fadeOut(0.2)
                        ),
                        cc.callFunc(function (target, data) {
                            target.removeFromParent(true);
                        })
                    ));

                    return true;
                }
                break;
            }
        }
    }
    return false;
}

function copyJsonObj(obj) {
    var jsonStr = JSON.stringify(obj);
    return JSON.parse(jsonStr);
}

function getMonthEvtByType(evtType) {
    var evts = [];
    for (var i = 0; i < this.monthEvtInfo.length; i++) {
        if (this.monthEvtInfo[i].eventType == evtType) {
            evts.push(this.monthEvtInfo[i]);
        }
    }
    return evts;
}

function getWheelAward() {
    var weights = [];
    for (var key in this.cfgTurntable) {
        weights.push(this.cfgTurntable[key].power);
    }
    var index = this.getPercentage(weights);
    return this.cfgTurntable[index];
}

function loadTexture(parentNode, paths, name) {
    var node = parentNode;
    for (var i = 0; i < paths.length; i++) {
        node = node.getChildByName(paths[i]);
    }
    node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.res_loaded[name]);
    return node;
}

function getGuideInfo(id) {
    for (var i = 0; i < this.cfgGuide.length; i++) {
        if (this.cfgGuide[i].id == id) {
            return this.cfgGuide[i];
        }
    }
    return null;
}

function showGuide(id, parent, prefab) {
    if (this.saveData.curStore == 2) {
        return;
    }
    // if (this.saveData.newbie == null && id != 4101){
    //     return;
    // }
    var info = this.getGuideInfo(id);
    if (!info) {
        return;
    }

    if (CC_WECHATGAME) wx.aldSendEvent('新手引导', {id: info.sysName});

    if (this.newbieNode)
        this.newbieNode.removeFromParent(true);

    if (info.type != 3) {
        var newbie = cc.instantiate(prefab);
        newbie.parent = parent;
        newbie.getComponent('Newbie').init(info);

        console.log(info)
        if (id == 4202) {
            newbie.setPosition(parent.getChildByName("btnPause").position);
        } else {
            var pos = info.position.indexOf(',');
            var x = Number(info.position.substring(0, pos));
            var y = Number(info.position.substring(pos + 1, info.position.length));
            newbie.setPosition(x, y);
        }
        if (id == 4602) {
            this.loadTexture(newbie, ["newbie_1"], "png_newbie_1");
        }

        this.newbieNode = newbie;
        this.newbiePrefab = prefab;
    } else {
        this.newbieNode = null;
        this.newbiePrefab = null;
    }

    this.setComData("newbie", id);
}

function addGuide(guideId, isContinue) {
    if (!this.newbieNode) {
        console.log("未发现引导蒙板！");
        return;
    }
    var parent = this.newbieNode.parent;
    this.newbieNode.removeFromParent(true);
    if (isContinue) {
        this.showGuide(guideId + 1, parent, this.newbiePrefab);
    } else {
        if (this.saveData.newbie == 4106 || this.saveData.newbie == 4306 || this.saveData.newbie == 4603) {
            parent.getComponent('GameUI').resumeGame();
        }
        this.newbieNode = null;
        this.newbiePrefab = null;
    }
}

function getTask() {
    var info = [];
    for (var i = 0; i < this.cfgTask.length; i++) {
        if (this.cfgTask[i].month == this.saveData.month - 1) {
            info.push(this.cfgTask[i]);
        }
    }
    info.sort(function (a, b) {
        if (a.type > b.type) {
            return 1;
        } else if (a.type < b.type) {
            return -1
        } else {
            return 0;
        }
    });
    return info;
}

function getFoodProportion(id) {
    for (var i = 0; i < this.cfgFood.length; i++) {
        if (this.cfgFood[i].id == id) {
            return this.cfgFood[i].Proportion;
        }
    }
    return 1.0;
}

function getPurchase() {
    var data = [300, 3000];
    this.cfgParam.forEach((val, key) => {
        if (val.id == '1023') {
            data[0] = Number(val.param);
        }
        if (val.id == '1024') {
            data[1] = Number(val.param);
        }
    });
    return data
}

module.exports = {
    project_name: "cooking",
    res_key: null,
    res_cfg: [],
    res_loaded: [],
    serverUrl: "https://www.yunduofilm.com",
    serverUrl_res: "https://cba.yunduofilm.com/",
    saveInterval: 60,
    friendId: 0,
    helpTimes: 0,

    humanIds: [3101, 3102, 3201, 3301],
    monthEvtInfo: [],
    fluctuate: 0,
    isSave: true,
    saveTimestamp: 0,
    newbieNode: null,
    newbiePrefab: null,
    wheelUIScript: null,
    dlgGetGoldScript: null,
    monthOverScript: null,
    dlgScript: null,
    isLogin: true,

    //以下是需要存服务器的数据
    saveData: {
        month: 1,
        gold: 0,
        diamond: 0,
        praise: 0,
        gift: 0,
        shopItem: {
            "220": 2201,
            "210": 2101,
            "221": 2211,
            "110": 1101,
            "120": 1201,
            "121": 1211,
        },
        foods: [11101, 11201],    //目前可以做的菜
        achive: {},
        achiveHistory: [],
        newbie: 0,
        loginShare: [0, 0, 0],
        curStore: 1,            //当前店铺
        allStore: 1,            //总共店铺
        startMonth: [],
    },
    //以下是全局方法
    loadTexture: loadTexture,
    initUserDataFromServer: initUserDataFromServer,
    saveUserData: saveUserData,
    setComData: setComData,
    setAchive: setAchive,
    copyJsonObj: copyJsonObj,
    getGolds: getGolds,
    getMonthEvtByType: getMonthEvtByType,
    getPercentage: getPercentage,
    getMachineLevel: getMachineLevel,
    initCom: initCom,
    canScorch: canScorch,
    getDurationByID: getDurationByID,
    getMachineType: getMachineType,
    getMachineItemByID: getMachineItemByID,
    getMaterialsType: getMaterialsType,
    getMaterialsLevel: getMaterialsLevel,
    getDishesByID: getDishesByID,
    getFoodCompose: getFoodCompose,
    isSameFoodCompose: isSameFoodCompose,
    getFoodLvl: getFoodLvl,
    isSameMaterial: isSameMaterial,
    getFluctPeople: getFluctPeople,
    getMonthTarget: getMonthTarget,
    getMTarget: getMTarget,
    getMonthScoreById: getMonthScoreById,
    getNewScoreById: getNewScoreById,
    getMonthEvent: getMonthEvent,
    getEventInfo: getEventInfo,
    getParam: getParam,
    getHumanInfo: getHumanInfo,
    getWheelAward: getWheelAward,
    getGuideInfo: getGuideInfo,
    showGuide: showGuide,
    addGuide: addGuide,
    getTask: getTask,
    getFoodProportion: getFoodProportion,
    getPurchase: getPurchase,
};
