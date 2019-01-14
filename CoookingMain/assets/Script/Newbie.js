cc.Class({
    extends: cc.Component,

    properties: {
        circleNode: {
            displayName: "圈圈", 
            default: null, 
            type: cc.Node
        },
        lbText: cc.Label,
    },

    onLoad() {
        this.com = require('common');
        this.httpUtils = require("httpUtils");
    },

    init: function(guideInfo){
        this.node.width = this.node.height = 10000;
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBg, this);

        var hand = this.node.getChildByName("shouzhi");
        if (guideInfo.type == 2){
            hand.x = 100;
            hand.runAction(cc.repeatForever(cc.sequence(
                cc.scaleTo(0.2, 0.9).easing(cc.easeBackIn()),
                cc.scaleTo(0.2, 1.0).easing(cc.easeBackOut())
            )));
        } else {
            hand.x = 10000;
        }

        var char = this.com.loadTexture(this.node, ["char"], "png_3301");
        var pos = guideInfo.charPos.indexOf(',');
        var x = Number(guideInfo.charPos.substring(0, pos));
        var y = Number(guideInfo.charPos.substring(pos + 1, guideInfo.charPos.length));
        char.setPosition(x, y);

        // this.lbText.string = "<b>" + guideInfo.dialog + "</b>";
        this.lbText.string =guideInfo.dialog ;
        pos = guideInfo.textPos.indexOf(',');
        x = Number(guideInfo.textPos.substring(0, pos));
        y = Number(guideInfo.textPos.substring(pos + 1, guideInfo.textPos.length));
        this.lbText.node.setPosition(x, y);

        this._info = guideInfo;
    },

    onTouchBg(event) {
        let point = event.getLocation();
        let retWord = this.circleNode.getBoundingBoxToWorld();
        let space = 10;
        retWord.width -= space;
        retWord.width = retWord.width <= 0 ? 0 : retWord.width;
        retWord.height -= space;
        retWord.height = retWord.height <= 0 ? 0 : retWord.height;
        if (retWord.contains(point)) {
            if (this._info.type == 1){
                //this.node._touchListener.setSwallowTouches(true);
                this.com.addGuide(this._info.id, this._info.isContinue);
            } else if (this._info.type == 2){
                this.node._touchListener.setSwallowTouches(false);
            }
        } else {
            if (this._info.type == 1){
                this.com.addGuide(this._info.id, this._info.isContinue);
            } else if (this._info.type == 2){
                this.node._touchListener.setSwallowTouches(true);
            }
            event.stopPropagation();
        }
        if (this.com.newbieNode){
            var parent = this.com.newbieNode.parent;
            if (this.com.saveData.month == 1 && this.com.saveData.newbie == 4204 && this.com.isSave){
                this.com.showGuide(4205, parent, parent.getComponent('GameUI').m_newbie);
            }
        }
    },
});