cc.Class({
    extends: cc.Component,

    properties: {
        avatarImgSprite: cc.Sprite,
        rankLabel: cc.Label,
        topScoreLabel: cc.Label,
        nickLabel: cc.Label,
        desLabel: cc.Label,
    },

    init: function (rank, data) {
        var nickName = "";
        if (data.nickName && data.nickName != "null")
            nickName = data.nickName
        this.nickLabel.string = nickName;

        var des = "";
        if (data.des && data.des != "null")
            des = data.des;
        this.desLabel.string = des;

        let grade = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        
        this.rankLabel.string = "我的排名:" + (rank + 1).toString();
        this.topScoreLabel.string = "金币：" + grade;
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
