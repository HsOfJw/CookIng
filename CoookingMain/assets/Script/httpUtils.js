var httpUtils = cc.Class({
    extends: cc.Component,

    properties: {
    },

    statics: {
        _instance: null
    },
 
    httpGets: function (url, callback, token) {
        // if (CC_WECHATGAME) 
            // wx.showLoading({
            //     //title:'请稍后...'
            // });
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)) {
                // if (CC_WECHATGAME) wx.hideLoading();
                var respone = xhr.responseText;
                callback(respone);
            }
        };
        xhr.open("GET", url, true);
        if (token) {
            xhr.setRequestHeader("Authorization", "Bearer "+token);
        }
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
 
        // note: In Internet Explorer, the timeout property may be set only after calling the open()
        // method and before calling the send() method.
        xhr.timeout = 5000;// 5 seconds for timeout
 
        xhr.send();
    },
 
    httpPost: function (url, params, callback, token) {
        // if (CC_WECHATGAME) 
        //     wx.showLoading({
        //         //title:'请稍后...'
        //     });

        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            console.log('xhr.readyState='+xhr.readyState+'  xhr.status='+xhr.status);
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)) {
                // if (CC_WECHATGAME) wx.hideLoading();
                
                var respone = xhr.responseText;
                callback(respone);
            }
        };
        xhr.open("POST", url, true);
        if (token) {
            xhr.setRequestHeader("Authorization", "Bearer "+token);
        }
        xhr.setRequestHeader("Content-Type", "application/json");

        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
 
        // note: In Internet Explorer, the timeout property may be set only after calling the open()
        // method and before calling the send() method.
        xhr.timeout = 5000;// 5 seconds for timeout
 
        xhr.send(params);
    },
});

httpUtils._instance = new httpUtils();
module.exports = httpUtils;
