
function load(prefab_name, cb) {
    cc.loader.loadRes(prefab_name, cc.Prefab, function(err, prefab) {
        if (err) {
            console.log(err);
        } else {
            let instance = cc.instantiate(prefab);
            cb(instance);
        }
    });
}

function tip(node, info) {
        load('panel_popup_tip', function(instance) {
            if (!instance) return;
            instance.getComponent('panel_popup_tip').set_info(info, function(){
                instance.parent = null;
                instance.destroy();
            });

            instance.parent = node;
        });
}

module.exports = {
	tip: tip,
}