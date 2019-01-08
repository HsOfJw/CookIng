cc.Class({
    extends: cc.Component,

    properties: {
        m_btnItem: cc.Node,
        m_dishes: [],
        isOpenBtn: false,
        // holdTimeEclipse: 0,        //用来检测长按
        // holdClick: false,          //用来检测点击
        // hold_one_click: 0,         //用来检测单击
    },

    onLoad (){
        this.com = require('common');
        this.httpUtils = require("httpUtils");

        var parent = this.node;
        while (parent.parent != null){
            parent = parent.parent;
        }
        this.script_gameUI = parent.children[0].getComponent("GameUI");
        if (this.com.saveData.curStore == 2){
            this.script_gameUI = parent.children[0].getComponent("CookingUI");
        }
    },

    init: function(isOpenBtn, dishes, scale) {
        this.m_dishes[this.m_dishes.length] = dishes;

        if (this.com == null){
            this.com = require('common');
        }

        var item = this.node.getChildByName("item");
        var ret = this.com.isSameFoodCompose(this.m_dishes);
        item.scale = scale;
        if (ret.id > 0 && ret.lvl > 0){
            item.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_"+ret.id+"_"+ret.lvl]);
        } else {
            //
            var lvl = this.com.getFoodLvl(dishes);
            if (lvl > 0){
                item.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_"+dishes+"_"+lvl]);
            } else{
                item.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.com.res_loaded["png_"+dishes]);
            }
        }
        
        this.isOpenBtn = isOpenBtn;
        if (!isOpenBtn)
            return;

        var this_ = this;
        this.m_btnItem.on(cc.Node.EventType.TOUCH_START, function(event){
            this_.btnClick(event);
        },this.m_btnItem);

        this.m_btnItem.on(cc.Node.EventType.TOUCH_END, function(event){
            var rect = this_.script_gameUI.m_ndRecycle.getBoundingBoxToWorld();
            if ( rect.contains(event.getLocation()) ) {
                this_.node.removeFromParent(true);

                this_.script_gameUI.m_wasteFoods++;

                if (this_.com.saveData.curStore != 2){
                    this_.script_gameUI.m_ndRecycle.runAction(cc.sequence(
                        cc.delayTime(1.2),
                        cc.callFunc(function(target, data){
                            target._isOpen = false;
                            target.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this_.com.res_loaded["png_chuju_lajixiang"]);
                        })
                    ));
                }
            } else {
                this.setPosition(cc.v2(0,0));
            }
        },this.m_btnItem);

        this.m_btnItem.on(cc.Node.EventType.TOUCH_MOVE, function(event){
            var space_pos = this.parent.convertToNodeSpaceAR(event.getLocation());
            this.setPosition(space_pos);

            var rect = this_.script_gameUI.m_ndRecycle.getBoundingBoxToWorld();
            var isContain = rect.contains(event.getLocation());
            if (isContain && !this_.script_gameUI.m_ndRecycle._isOpen && this_.com.saveData.curStore != 2) {
                this_.script_gameUI.m_ndRecycle._isOpen = true;
                this_.script_gameUI.m_ndRecycle.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this_.com.res_loaded["png_chuju_lajixiang_kai"]);
            }
            if (!isContain && this_.script_gameUI.m_ndRecycle._isOpen && this_.com.saveData.curStore != 2) {
                this_.script_gameUI.m_ndRecycle._isOpen = false;
                this_.script_gameUI.m_ndRecycle.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this_.com.res_loaded["png_chuju_lajixiang"]);
            }
        },this.m_btnItem);

        // var this_ = this;

        // //touchstart   touchend
        // this.m_btnItem.on(cc.Node.EventType.TOUCH_START, function(event){
        //     this_.holdClick = true;
        //     this_.holdTimeEclipse = 0;
        // },this.m_btnItem);

        // this.m_btnItem.on(cc.Node.EventType.TOUCH_END, function(event){           
        //     this_.holdClick=false;
        //     if(this_.holdTimeEclipse>=30)
        //     {                
        //         this_.btn_status('long', event);                
        //     }
        //     else
        //     {                
        //         this_.btn_status('short', event);            
        //     }    
        //     //开始记录时间
        //     this_.holdTimeEclipse=0; 
        // },this.m_btnItem);
    },

    start () {

    },

    addMaterial: function(material){
        // this.m_btnItem.runAction(cc.sequence(
        //     cc.scaleTo(0.3, 1.2),
        //     cc.scaleTo(0.2, 0.9),
        //     cc.scaleTo(0.1, 1.0)
        // ));
        this.m_dishes[this.m_dishes.length] = material;
        var id = this.com.getFoodCompose(this.m_dishes);
        if (id > 0){
            var lv = this.com.getFoodLvl(id);
            this.com.loadTexture(this.node, ["item"], "png_"+id+"_"+lv);
        }
    },

    // btn_status: function(status, event){
    //     if(status == 'short')
    //     {
    //         //console.log(this.hold_one_click)
    //         this.hold_one_click++;
    //         setTimeout(() => {
    //             if(this.hold_one_click == 1)
    //             {
    //                 //console.log('short');
    //                 this.hold_one_click = 0;
    //                 this.btnClick(event);
    //             } 
    //             else if(this.hold_one_click == 2)
    //             {
    //                 //console.log('double');
    //                 this.hold_one_click = 0;
    //                 this.btnDoubleClick(event);
    //             }              
    //         }, 400);
            
    //     }
    //     else
    //     {
    //         this.hold_one_click = 0;
    //         //console.log(status);
    //         this.btnClick(event);
    //     }
    // },

    btnClick: function(event){
        // var scale = this.m_btnItem.scale;
        // this.m_btnItem.runAction(cc.sequence(
        //     cc.scaleTo(0.3, 1.2*scale),
        //     cc.scaleTo(0.2, 0.9*scale),
        //     cc.scaleTo(0.1, 1.0*scale)
        // ));

        var ret = this.com.isSameFoodCompose(this.m_dishes);
        var customerId = this.script_gameUI.canSellout(ret.id);
        if (customerId >= 0){
            var pos = this.node.parent.convertToWorldSpaceAR(this.node.position);
            this.script_gameUI.sellout(ret.id, customerId, pos, this.com.getGolds(this.m_dishes));
            this.node.removeFromParent(true);
        }
    },

    // btnDoubleClick: function(event){
    //     this.node.dispatchEvent(new cc.Event.EventCustom("wasteDishes", true));
    //     this.node.removeFromParent(true);
    // },

    // update (dt) {
    //     if (this.isOpenBtn){
    //         if(this.holdClick){
    //             this.holdTimeEclipse++;
    //             if(this.holdTimeEclipse>120)//如果长按时间大于2s，则认为长按了2s
    //             {
    //                 this.holdTimeEclipse=120;
    //             }
    //         }
    //     }
    // },
});
