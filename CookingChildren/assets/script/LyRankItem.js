cc.Class({
    extends: cc.Component,

    properties: {
        lbRanking: cc.Label,
        avatarImgSprite: cc.Sprite,
        nickLabel: cc.Label,
        desLabel: cc.Label,
        numLabel: cc.Label,
        sexSprite: cc.Node,
        jin: cc.Sprite,
        yin: cc.Sprite,
        tong: cc.Sprite,
        nv: cc.Sprite,
        nan: cc.Sprite,
    },

    init: function(ranking, info, type){
        var itemInfo = JSON.parse(info.KVDataList[0].value);
        
        this.nickLabel.string = info.nickname;

        var des = "";
        if (itemInfo.des && itemInfo.des != "null")
            des = itemInfo.des;
        this.desLabel.string = des;

        var score = 0;
        if (itemInfo.score && itemInfo.score != "null")
            score = itemInfo.score;
        if (type == 0){
            this.numLabel.string = "好评: " + score;
        } else if (type == 1){
            this.numLabel.string = "金币: " + score;
        }

        if (itemInfo.sex){
            this.nv.node.x = this.sexSprite.x;
            this.nv.node.y = this.sexSprite.y;
        } else {
            this.nan.node.x = this.sexSprite.x;
            this.nan.node.y = this.sexSprite.y;
        }

        if (ranking == 0){
            this.lbRanking.string = "";
            this.jin.node.x = this.lbRanking.node.x;
            this.jin.node.y = this.lbRanking.node.y;
        } else if(ranking == 1){
            this.lbRanking.string = "";
            this.yin.node.x = this.lbRanking.node.x;
            this.yin.node.y = this.lbRanking.node.y;
        } else if(ranking == 2){
            this.lbRanking.string = "";
            this.tong.node.x = this.lbRanking.node.x;
            this.tong.node.y = this.lbRanking.node.y;
        } else {
            this.lbRanking.string = parseInt(ranking + 1);
        }

        this.createImage(info.avatarUrl);
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
                        cc.log(e);
                        this.avatarImgSprite.node.active = false;
                    }
                };
                image.src = avatarUrl;
            }catch (e) {
                cc.log(e);
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
});
