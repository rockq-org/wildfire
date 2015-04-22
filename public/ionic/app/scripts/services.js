angular.module('iwildfire.services', ['ngResource'])

.factory('Tabs', function() {
    return [{
        value: 'books',
        label: '教材书籍'
    }, {
        value: 'transports',
        label: '代步工具'
    }, {
        value: 'electronics',
        label: '数码电器'
    }, {
        value: 'supplies',
        label: '生活用品'
    }, {
        value: 'healthcare',
        label: '运动健身'
    }, {
        value: 'clothes',
        label: '衣帽饰物'
    }, {
        value: 'others',
        label: '其它'
    }];
})

.factory('Messages', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
        id: 0,
        userId: '00001',
        name: 'tb234243',
        lastText: '用户直接跟你对话的，这里显示你们最后一条的对话内容（可能是你的也可能是他的）点击后最顶部是宝贝的链接',
        face: 'images/dummy/avatar.jpeg'
    }, {
        id: 1,
        userId: '00002',
        name: '宝贝留言',
        lastText: 'tb234243: 有点贵哦（这个是用户名+宝贝留言内容，点击到达宝贝页面的留言位置）',
        face: 'images/dummy/1.jpg'
    }, {
        id: 1,
        userId: '00002',
        name: 'name here',
        lastText: 'less text',
        face: 'images/dummy/1.jpg'
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

    /**
     * upload wechat images
     * @return {[type]} [description]
     */
    this.uploadWechatImages = function(serverIds) {
        var deferred = $q.defer();
        $http.post('{0}/ionic/wechat-images'.f(cfg.api), {
                accesstoken: store.getAccessToken(),
                serverIds: serverIds
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .success(function(result) {
                // get the result in
                // https://github.com/arrking/wildfire/issues/54
                if (result.rc == 0) {
                    /**
                     * msg
                     * [{serverId, imageUrl}]
                     */
                    deferred.resolve(result.msg);
                } else {
                    deferred.reject(result);
                }
            })
            .error(function(err) {
                deferred.reject(err);
            });

        return deferred.promise;
    }

    this.getWechatSignature = function() {
        var deferred = $q.defer();
        // should not use encodeURIComponent
        var app_url = window.location.href.split('#')[0];
        var accesstoken = store.getAccessToken();

        // when the server domain is registered in
        // wechat plaform. If not, the signature can be
        // generated with this app url.
        if (!accesstoken) {
            deferred.resolve();
        } else if (S(cfg.server).contains('arrking.com')) {
            $http.post('{0}/ionic/wechat-signature'.f(cfg.api), {
                    accesstoken: accesstoken,
                    app_url: app_url
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
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
                        deferred.resolve();
                    }
                })
                .error(function(err) {
                    deferred.resolve();
                })
        } else {
            // wechat signature is assigned to undefined if
            // APP_URL is not belong to arrking.com.
            deferred.resolve();
        }

        return deferred.promise;
    }

    this.sendVerifyCode = function(phoneNumber) {
        var deferred = $q.defer();
        $http.post('{0}/user/bind_phone_number'.f(cfg.api), {
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

        $http.post('{0}/user/check_phone_verifycode'.f(cfg.api), {
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
        $http.get('{0}/accesstoken'.f(cfg.api))
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
        $http.post('{0}/accesstoken'.f(cfg.api), {
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

    this.createNewGoods = function(params) {
        var deferred = $q.defer();
        // https://github.com/arrking/wildfire/issues/53
        $http.post('{0}/topics'.f(cfg.api), {
                /*debug*/
                // accesstoken: 'd8e60e1f-b4ba-4a1b-9eaa-56e9f6a8d5f0',
                accesstoken: store.getAccessToken(),
                title: params.title,
                tab: params.tab,
                content: params.content,
                goods_pics: params.goods_pics,
                goods_quality_degree: params.quality,
                goods_pre_price: params.goods_pre_price,
                goods_now_price: params.goods_now_price,
                goods_is_bargain: params.goods_is_bargain,
                goods_exchange_location: params.goods_exchange_location,
                goods_status: params.goods_status
            })
            .success(function(data) {
                deferred.resolve(data);
            })
            .error(function(err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    /**
     * retrieve topics by userId from backend service.
     * Should always return as resolve, even has error.
     * because the controller is depended on the resolve
     * state, when get an error, resolve as undefined.
     * See AccountCtrl
     * @return {[type]} [description]
     */
    this.getMyTopicsResolve = function() {
        var deferred = $q.defer();

        $http.get('{0}/user/my_topics?accesstoken={1}'.f(cfg.api,
                store.getAccessToken()
                // for debug usage in local machine
                // 'e26b54f0-6ca2-4eb7-97ae-a52c6af268dc'
            ))
            .success(function(data) {
                if (data.rc === 1) {
                    deferred.resolve(data.msg);
                } else {
                    deferred.resolve();
                }
            })
            .error(function(err) {
                deferred.resolve();
            });

        return deferred.promise;
    }

    /**
     * put my topic into off shelf status
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    this.offShelfMyTopic = function(topic) {
        var deferred = $q.defer();

        return deferred.promise;
    }

})


.factory('Tabs', function() {
    return [{
        value: 'all',
        label: '全部'
    }, {
        value: 'books',
        label: '教材书籍'
    }, {
        value: 'transports',
        label: '代步工具'
    }, {
        value: 'electronics',
        label: '数码电器'
    }, {
        value: 'supplies',
        label: '生活用品'
    }, {
        value: 'healthcare',
        label: '运动健身'
    }, {
        value: 'clothes',
        label: '衣帽饰物'
    }, {
        value: 'others',
        label: '其它'
    }];
})
/**
 * Manage Topics
 * Creating a CRUD App in Minutes with Angular’s $resource
 * http://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/
 * @param  {[type]} cfg         [description]
 * @param  {[type]} $resource   [description]
 * @param  {Object} $log)       {                   var User [description]
 * @param  {[type]} function(r) {                                               $log.debug('get topics tab:', tab, 'page:', page, 'data:', r.data);                return callback && callback(r [description]
 * @return {[type]}             [description]
 */
.factory('Topics', function(cfg, $resource, $log) {
        var User = {}; //do it later
        var topics = [];
        var currentTab = 'all';
        var nextPage = 1;
        var hasNextPage = true;
        var resource = $resource(cfg.api + '/topics', {}, {
            query: {
                method: 'get',
                params: {
                    tab: 'all',
                    page: 1,
                    limit: 10,
                    mdrender: true
                },
                timeout: 20000
            }
        });
        var getTopics = function(tab, page, callback) {
            return resource.query({
                tab: tab,
                page: page
            }, function(r) {
                $log.debug('get topics tab:', tab, 'page:', page, 'data:', r.data);
                return callback && callback(r);
            });
        };
        return {
            refresh: function() {
                return getTopics(currentTab, 1, function(response) {
                    nextPage = 2;
                    hasNextPage = true;
                    topics = response.data;
                });
            },
            pagination: function() {
                return getTopics(currentTab, nextPage, function(response) {
                    if (response.data.length < 10) {
                        $log.debug('response data length', response.data.length);
                        hasNextPage = false;
                    }
                    nextPage++;
                    topics = topics.concat(response.data);
                });
            },
            currentTab: function(newTab) {
                if (typeof newTab !== 'undefined') {
                    currentTab = newTab;
                }
                return currentTab;
            },
            hasNextPage: function(has) {
                if (typeof has !== 'undefined') {
                    hasNextPage = has;
                }
                return hasNextPage;
            },
            resetData: function() {
                topics = [];
                nextPage = 1;
                hasNextPage = true;
            },
            getTopics: function() {
                return topics;
            },
            getById: function(id) {

                if (!!topics) {
                    for (var i = 0; i < topics.length; i++) {
                        if (topics[i].id === id) {
                            return topics[i];
                        }
                    }
                } else {
                    return null;
                }
            },
            saveNewTopic: function(newTopicData) {
                var currentUser = User.getCurrentUser();
                return resource.save({
                    accesstoken: currentUser.accesstoken
                }, newTopicData);
            }
        };
    })
    .factory('Topic', function(cfg, $resource, $log, $q) {
        var User = {};
        var Settings = {};
        var topic;
        var resource = $resource(cfg.api + '/topic/:id', {
            id: '@id',
        }, {
            collect: {
                method: 'post',
                url: cfg.api + '/topic/collect'
            },
            deCollect: {
                method: 'post',
                url: cfg.api + '/topic/de_collect'
            },
            reply: {
                method: 'post',
                url: cfg.api + '/topic/:topicId/replies'
            },
            upReply: {
                method: 'post',
                url: cfg.api + '/reply/:replyId/ups'
            }
        });
        return {
            getById: function(id) {
                if (topic !== undefined && topic.id === id) {
                    var topicDefer = $q.defer();
                    topicDefer.resolve({
                        data: topic
                    });
                    return {
                        $promise: topicDefer.promise
                    };
                }
                return this.get(id);
            },
            get: function(id) {
                return resource.get({
                    id: id
                }, function(response) {
                    topic = response.data;
                });
            },
            saveReply: function(topicId, replyData) {
                var reply = angular.extend({}, replyData);
                var currentUser = User.getCurrentUser();
                // add send from
                if (Settings.getSettings().sendFrom) {
                    reply.content = replyData.content + '\n 自豪地采用 [CNodeJS ionic](https://github.com/lanceli/cnodejs-ionic)';
                }
                return resource.reply({
                    topicId: topicId,
                    accesstoken: currentUser.accesstoken
                }, reply);
            },
            upReply: function(replyId) {
                var currentUser = User.getCurrentUser();
                return resource.upReply({
                    replyId: replyId,
                    accesstoken: currentUser.accesstoken
                }, null, function(response) {
                    if (response.success) {
                        angular.forEach(topic.replies, function(reply, key) {
                            if (reply.id === replyId) {
                                if (response.action === 'up') {
                                    reply.ups.push(currentUser.id);
                                } else {
                                    reply.ups.pop();
                                }
                            }
                        });
                    }
                });
            },
            collectTopic: function(topicId) {
                var currentUser = User.getCurrentUser();
                return resource.collect({
                    topic_id: topicId,
                    accesstoken: currentUser.accesstoken
                });
            },
            deCollectTopic: function(topicId) {
                var currentUser = User.getCurrentUser();
                return resource.deCollect({
                    topic_id: topicId,
                    accesstoken: currentUser.accesstoken
                });
            }
        };
    });
