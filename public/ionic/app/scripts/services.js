angular.module('iwildfire.services', [])

.factory('Chats', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
        id: 0,
        userId: '00001',
        name: 'tb234243',
        lastText: '用户直接跟你对话的，这里显示你们最后一条的对话内容（可能是你的也可能是他的）点击后最顶部是宝贝的链接',
        face: 'templates/tab-inbox-imgs/avatar.jpeg'
    }, {
        id: 1,
        userId: '00002',
        name: '宝贝留言',
        lastText: 'tb234243: 有点贵哦（这个是用户名+宝贝留言内容，点击到达宝贝页面的留言位置）',
        face: 'templates/tab-inbox-imgs/1.jpg'
    }, {
        id: 1,
        userId: '00002',
        name: 'name here',
        lastText: 'less text',
        face: 'templates/tab-inbox-imgs/1.jpg'
    }];

    return {
        all: function() {
            return chats;
        },
        remove: function(chat) {
            chats.splice(chats.indexOf(chat), 1);
        },
        get: function(chatId) {
            for (var i = 0; i < chats.length; i++) {
                if (chats[i].id === parseInt(chatId)) {
                    return chats[i];
                }
            }
            return null;
        }
    };
})

/**
 * http://www.zhihu.com/question/21323842
 */
.service('store', function($log, cfg) {

    this.setAccessToken = function(data) {
        window.localStorage.setItem('WILDFIRE_ACCESS_TOKEN', data);
    };

    this.getAccessToken = function() {
        return window.localStorage.getItem('WILDFIRE_ACCESS_TOKEN');
    };

    this.deleteAccessToken = function() {
        window.localStorage.removeItem('WILDFIRE_ACCESS_TOKEN');
    };

    /**
     * save user profile data into localstorage
     * @param {json} data json object of this user
     */
    this.setUserProfile = function(data) {
        if (data) {
            window.localStorage.setItem('WILDFIRE_USER_PROFILE', JSON.stringify(data));
        }
    };

    this.getUserProfile = function() {
        var rawProfile = window.localStorage.getItem('WILDFIRE_USER_PROFILE');
        if (rawProfile) {
            return JSON.parse(rawProfile);
        } else {
            return null;
        }
    };

    this.deleteUserProfile = function() {
        window.removeItem('WILDFIRE_USER_PROFILE');
    };

})



/**
 * communicate with server, post/get request, return promise.
 * @param  {[type]} $http [description]
 * @param  {[type]} $q    [description]
 * @param  {[type]} $log  [description]
 * @param  {[type]} cfg)  {               this.sendVerifyCode [description]
 * @return {[type]}       [description]
 */
.service('webq', function($http, $q, $log, cfg, store) {

    this.getWechatSignature = function() {
        var deferred = $q.defer();
        // should not use encodeURIComponent
        var app_url = window.location.href.split('#')[0];
        var accesstoken = store.getAccessToken();

        $http.post('{0}/api/v1/ionic/wecat-signature'.f(cfg.server), {
                accesstoken: accesstoken,
                app_url: app_url
            })
            .success(function(data) {
                /**
                 * data.rc: 0 --> succ; others --> fail
                 * data.msg
                 * >>
                 * {
                    debug: wxConfig.debug,
                    appId: wxConfig.appId,
                    timestamp: wxCredentials.timestamp,
                    nonceStr: wxCredentials.noncestr,
                    signature: wxCredentials.signature,
                    // 附录2-所有JS接口列表
                    // http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#.E6.8B.8D.E7.85.A7.E6.88.96.E4.BB.8E.E6.89.8B.E6.9C.BA.E7.9B.B8.E5.86.8C.E4.B8.AD.E9.80.89.E5.9B.BE.E6.8E.A5.E5.8F.A3
                    // jsApiList可以在客户端用的时候再调整
                    jsApiList: ['scanQRCode', 'chooseImage', 'getLocation', 'openLocation']
                };
                 * <<
                 * jsApiList和debug 可以在客户端修改
                 */
                if (typeof(data) == 'object' &&
                    data.rc == 0) {
                    deferred.resolve(data.msg);
                } else {
                    deferred.reject(data);
                }
            })
            .error(function(err) {
                deferred.reject(err);
            })

        return deferred.promise;
    }

    this.sendVerifyCode = function(phoneNumber) {
        var deferred = $q.defer();
        $http.post('{0}/api/v1/user/bind_phone_number'.f(cfg.server), {
                phoneNumber: phoneNumber,
                accesstoken: store.getAccessToken()
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .success(function(data) {
                if (typeof data === 'object' && data.rc === 0) {
                    deferred.resolve(data);
                } else {
                    deferred.reject(data);
                }
            })
            .error(function(err) {
                deferred.reject(err);
            });

        return deferred.promise;
    }

    this.checkVerifyCode = function(phoneNumber, verifyCode) {
        var deferred = $q.defer();

        $http.post('{0}/api/v1/user/check_phone_verifycode'.f(cfg.server), {
                accesstoken: store.getAccessToken(),
                code: verifyCode,
                phoneNumber: phoneNumber
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .success(function(result) {
                if (typeof result == 'object' && result.rc == 0) {
                    deferred.resolve(result);
                } else {
                    deferred.reject(result);
                }
            })
            .error(function(err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    // get access token, assume the browser has contained valid cookie.
    this.getAccessToken = function() {
        var deferred = $q.defer();
        $http.get('{0}/api/v1/accesstoken'.f(cfg.server))
            .success(function(data) {
                if (typeof(data) === 'object' && data.rc == 0) {
                    // https://github.com/arrking/wildfire/issues/63
                    /**
                     * {
            rc: 0,
            loginname: req.session.user.loginname,
            avatar_url: req.session.user.avatar_url,
            id: req.session.user.id,
            accesstoken: req.session.user.accessToken
        }
                     */
                    deferred.resolve(data);
                } else {
                    deferred.reject(data);
                }
            })
            .error(function(err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    this.getUserProfile = function() {
        var deferred = $q.defer();
        $http.post('{0}/api/v1/accesstoken'.f(cfg.server), {
                accesstoken: store.getAccessToken()
            })
            .success(function(data) {
                if (data.success) {
                    deferred.resolve(data.profile);
                } else {
                    deferred.reject(data);
                }
            })
            .error(function(err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }

})

;
