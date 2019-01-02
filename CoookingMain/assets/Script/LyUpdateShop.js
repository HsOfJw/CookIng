cc.Class({
    extends: cc.Component,

    properties: {
        m_PageContent: cc.Node,
        m_PageContent2: cc.Node,
        m_item: cc.Prefab,
        m_upgradeItem: cc.Prefab,
        m_itemInfo: cc.Prefab,
        m_dlgGiveGold: cc.Prefab,
        m_praise: cc.Label,
        m_gold: cc.Label,
        m_diamond: cc.Label,
        avatarImgSprite: cc.Sprite,
        texView: cc.Sprite,//显示排行榜
        tex_bg: cc.Sprite,
        btn_back_qun_button: cc.Button
    },

    onLoad () {
        this.com = require('common');
        this.httpUtils = require("httpUtils");
        this.node_anim = this.node.runAction(cc.sequence(
            cc.scaleTo(0.05, 1.1),
            cc.scaleTo(0.2, 1.0)
        ));
        this.node.on('openUpgrade', this.openUpgrade, this);
        this.node.on('upgradeItem', this.upgradeItem, this);
        this.node.on('openItemInfo', this.openItemInfo, this);
        this.node.on('upGold', this.upGold, this);
        this.node.on('upDiamond', this.upDiamond, this);

        this.com.loadTexture(this.node, ["bg"], "jpg_shengji_bj");
        this.com.loadTexture(this.node, ["beijng"], "png_shengji_jiazi");
        this.com.loadTexture(this.node, ["btnReturn"], "png_shengji_fanhui");

        this.btn_back_qun_button.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_shengji_fanhui"]);

        this.com.loadTexture(this.node, ["qunpaihang"], "png_qunpaihang");
        this.com.loadTexture(this.node, ["aixin"], "png_zhujiemian_aixin");
        this.com.loadTexture(this.node, ["jinbi"], "png_zhujiemian_jinbi");
        this.com.loadTexture(this.node, ["button"], "png_zhujiemian_jia");
        this.com.loadTexture(this.node, ["zuanshi"], "png_zhujiemian_zuanshi");
        this.com.loadTexture(this.node, ["button1"], "png_zhujiemian_jia");

        if(CC_WECHATGAME){
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 1560;
            window.sharedCanvas.height = 720;
        }
    },

    start () {
    },

    sortRec(){
        var shopRecommend = [];
        for(var key in this.com.saveData.shopItem){
            var item = this.com.getMachineItemByID(this.com.saveData.shopItem[key]);
            if(item){
                var list = item.list;
                if(list){
                    var array = {key:key, val:list, itemId: item.ID}
                    shopRecommend.push(array)
                }
            }
        }
        shopRecommend.sort(function(a, b){
            if (a.val>b.val) {
                return 1;
            }else if(a.val<b.val){
                return -1
            }else{
                return 0;
            }
        });
        return shopRecommend
    },

    init: function(){
        var shopRecommend = this.sortRec();
        for(var key in this.com.saveData.shopItem){
            var id = this.com.saveData.shopItem[key];
            if (this.com.saveData.curStore == null || this.com.saveData.curStore == 1){
                if (!((id >= 1101 && id <= 1325) || (id >= 2101 && id <= 2313))){
                    continue;
                }
            }
            if (this.com.saveData.curStore == 2){
                if ((id >= 1101 && id <= 1325) || (id >= 2101 && id <= 2313)){
                    continue;
                }
            }
            var item = cc.instantiate(this.m_item);
            this.m_PageContent.addChild(item);
            item.getComponent("shopItem").init(this.com.saveData.shopItem[key]);
            item.getComponent("shopItem").setChoose("li");
            // if(key == shopRecommend[0].key){
            //     item.getComponent("shopItem").setShopRecommendShow(true);
            // }else{
            //     item.getComponent("shopItem").setShopRecommendShow(false);
            // }

            var item2 = cc.instantiate(this.m_item);
            this.m_PageContent2.addChild(item2);
            item2.getComponent("shopItem").init(this.com.saveData.shopItem[key]);
            item2.getComponent("shopItem").setChoose("wai");
            if(shopRecommend.length > 0 && key == shopRecommend[0].key){
                item2.getComponent("shopItem").setShopRecommendShow(true);
            }else{
                item2.getComponent("shopItem").setShopRecommendShow(false);
            }
        }

        this.m_praise.string = this.com.saveData.praise;
        this.m_gold.string = this.com.saveData.gold;
        this.m_diamond.string = this.com.saveData.diamond;
        var avatarUrl = cc.sys.localStorage.getItem("avatarUrl");
        if(avatarUrl){
            this.createImage(avatarUrl);
        }
    },

    btnClose: function(event, coustEvent) {
        if(this.node_anim) this.node.stopAction(this.node_anim);
        this.node.dispatchEvent(new cc.Event.EventCustom("closeShop", true));

        this.node.removeFromParent(true);
    },

    openUpgrade: function(event){
        var param = event.getUserData();

        var upgrade = cc.instantiate(this.m_upgradeItem);
        upgrade.parent = this.node;
        upgrade.getComponent("LyUpgradeItem").init(param.itemId);

        event.stopPropagation();
    },

    openItemInfo: function(event){
        var param = event.getUserData();

        var itemInfo = cc.instantiate(this.m_itemInfo);
        itemInfo.parent = this.node;
        itemInfo.getComponent("LyItemInfo").init(param.itemId);

        event.stopPropagation();
    },

    upgradeItem: function(event){
        var param = event.getUserData();
        for(var i=0; i<this.m_PageContent.children.length; i++){
            var script = this.m_PageContent.children[i].getComponent("shopItem");
            if (script && script.m_itemId == param.itemId - 1){
                script.init(param.itemId);
                script.setChoose("li");
                script.m_upgrade.node.x = 60;
                script.m_upgrade.animation = "1";
            }
            
            // var shopRecommend = this.sortRec();
            // if(this.m_PageContent.children[i].getComponent("shopItem").m_itemId == shopRecommend[0].itemId){
            //     script.setShopRecommendShow(true);
            // }else{
            //     script.setShopRecommendShow(false);
            // }

            var script2 = this.m_PageContent2.children[i].getComponent("shopItem");
            if (script2 && script2.m_itemId == param.itemId - 1){
                script2.init(param.itemId);
                script2.setChoose("wai");
            }
            
            var shopRecommend = this.sortRec();
            if(shopRecommend.length > 0 && this.m_PageContent2.children[i].getComponent("shopItem").m_itemId == shopRecommend[0].itemId){
                script2.setShopRecommendShow(true);
            }else{
                script2.setShopRecommendShow(false);
            }
        }

        //this.m_praise.string = this.com.saveData.praise;
        this.m_gold.string = this.com.saveData.gold;
        //this.m_diamond.string = this.com.saveData.diamond;

        if (param.isDishes) this.com.setAchive(2, this.node);
    },

    btn_qunpaihang: function(event, coustEvent) {
        if (CC_WECHATGAME) wx.aldSendEvent('升级-查看群排行', {});

        var this_ = this;
        if (CC_WECHATGAME){
            wx.updateShareMenu({
                withShareTicket: true
            });
            cc.loader.loadRes("texture/share",function(err,data){
                wx.shareAppMessage({
                    title: "抖音上超火的网红游戏",
                    imageUrl: data.url,
                    success(res){
                        console.log("转发群成功!!!");
                        if(res.shareTickets == null || res.shareTickets == undefined || res.shareTickets == ""){
                            //没有群信息，说明分享的是个人
                            console.log("res.shareTickets is null");
                            wx.showModal({
                                //title:"分享失败",
                                content:"查看群排行需要分享到群",
                                showCancel:false
                            });
                        }else{
                            //有群信息
                            console.log("res.shareTickets is not null");
                            if(res.shareTickets.length > 0){
                                this.tex = new cc.Texture2D();
                                window.sharedCanvas.width = 1560;
                                window.sharedCanvas.height = 720;
                                window.wx.postMessage({
                                    messageType: 2,
                                    MAIN_MENU_NUM: "Cooking_fans",
                                    type: 1,
                                    shareTickets: res.shareTickets
                                });
                                this_.texView.node.active = true;
                                this_.tex_bg.node.active = true;
                            }
                            this_.com.setAchive(8, this_.node);
                        }
                    },
                    fail(res){
                        console.log("转发失败!!!");
                    }
                })
            });
        }
    },

    btn_back_qun(){
        this.texView.node.active = false;
        this.tex_bg.node.active = false;
    },

    btnGetGold: function(event, coustEvent){
        var dlgGiveGold = cc.instantiate(this.m_dlgGiveGold);
        dlgGiveGold.parent = this.node;
    },

    upGold: function(event){
        this.m_gold.string = this.com.saveData.gold;
    },

    upDiamond: function(event){
        this.m_diamond.string = this.com.saveData.diamond;
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
                        console.log(e);
                        this.avatarImgSprite.node.active = false;
                    }
                };
                image.src = avatarUrl;
            }catch (e) {
                console.log(e);
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

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.texView.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },
    update() {
        this._updateSubDomainCanvas();
    },
});
