angular.module('iwildfire.services', ['ngResource'])

.factory('Tabs', function() {
    var _Tabs = {};
    var list = [{
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

    _Tabs.getList = function() {
        return list;
    };

    _Tabs.getLabel = function(value) {
        for (i in list) {
            if (list[i]['value'] == value) {
                return list[i]['label'];
            }
        }
    };

    return _Tabs;
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

    this.getWeChatLocationDetail = function() {
        var deferred = $q.defer();
        this.getWechatSignature().then(function(wechat_signature) {
            // return for local debugging
            if (!wechat_signature)
                return;

            $log.debug(JSON.stringify(wechat_signature));


            wechat_signature.jsApiList = ['getLocation'];
            wx.config(wechat_signature);
            wx.error(function(err) {
                $log.debug(JSON.stringify(err));
                deferred.reject(err);
            });
            wx.ready(function() {
                wx.getLocation({
                    success: function(res) {
                        var locationDetail = res.detail;
                        deferred.resolve(locationDetail);
                    }
                });
            });
        });

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
    this.updateMyTopic = function(topic) {
        var deferred = $q.defer();
        $http.put('{0}/topic/{1}'.f(cfg.api, topic._id), {
                accesstoken: store.getAccessToken(),
                // for debug usage in local machine
                // accesstoken: 'e26b54f0-6ca2-4eb7-97ae-a52c6af268dc',
                topic: topic
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .success(function(data) {
                if (typeof(data) === 'object' && data.rc === 0) {
                    deferred.resolve(data.latest);
                } else {
                    // https://github.com/arrking/wildfire/issues/75
                    // Get more details about failure response
                    deferred.reject(data);
                }
            })
            .error(function(err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    /**
     * get user profile as resolve state
     * @return {[type]} [description]
     */
    this.getMyProfileResolve = function() {
        var deferred = $q.defer();
        // attempt to get user profile data with cookie
        this.getUserProfile()
            .then(function(data2) {
                store.setUserProfile(data2);
                deferred.resolve(data2);
            })
            .catch(function(err) {
                $log.warn('getUserProfileResolve');
                $log.warn(err);
                deferred.resolve();
            });

        return deferred.promise;
    }


    /**
     * submit feedback
     */
    this.submitFeedback = function(content) {
        var deferred = $q.defer();
        $http.post('{0}/ionic/feedback'.f(cfg.api), {
                accesstoken: store.getAccessToken(),
                content: content
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .success(function(data) {
                $log.debug('Get feedback response: ' + JSON.stringify(data));
                if (data && data.rc === 0) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            })
            .error(function(err) {
                $log.error('Get error response when submitting feedback.');
                $log.error(err);
                deferred.reject();
            });

        return deferred.promise;
    }

    // get user service agreements in markdown format
    this.getUserServiceAgreements = function() {
        var defer = $q.defer();
        $http({
            method: 'GET',
            url: '{0}/public/markdowns/user-service-agreements.md'.f(cfg.server)
        }).success(function(data, status, headers, config) {
            var converter = new Showdown.converter();
            defer.resolve(converter.makeHtml(data));
        }).error(function(err, status) {
            $log.error('Can not get /public/md/user-service-agreements.md from server.');
            defer.reject(err);
        });
        return defer.promise;
    };


    /**
     * Ding my topic
     * Update update_at value, so the record would
     * display at top in index page.
     */
    this.dingMyTopic = function(topic) {
        var deferred = $q.defer();

        $http.post('{0}/topic/ding'.f(cfg.api), {
                accesstoken: store.getAccessToken(),
                // accesstoken: 'e26b54f0-6ca2-4eb7-97ae-a52c6af268dc',
                topicId: topic._id
            })
            .success(function(data) {
                if (typeof(data) == 'object' &&
                    data.rc == 0) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            })
            .error(function(err) {
                deferred.reject();
            });

        return deferred.promise;
    };

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
    var text = null;
    var lng = null;
    var lat = null;
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
    var getTopics = function(tab, page, text, callback) {
        return resource.query({
            tab: tab,
            page: page,
            text: text,
            lng: lng,
            lat: lat
        }, function(r) {
            $log.debug('get topics tab:', tab, 'page:', page, 'data:', r.data);
            return callback && callback(r);
        });
    };
    return {
        refresh: function() {
            return getTopics(currentTab, 1, text, function(response) {
                nextPage = 2;
                hasNextPage = true;
                topics = response.data;
            });
        },
        pagination: function() {
            return getTopics(currentTab, nextPage, text, function(response) {
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
            text = {};
            nextPage = 1;
            hasNextPage = true;
        },
        getTopics: function() {
            return topics;
        },
        setQuery: function(query) {
            text = query
        },
        setGeom: function(geom) {
            lng = geom.longitude;
            lat = geom.latitude;
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

.factory('Topic', function(cfg, $resource, $log, $q, User) {
    //var User = {};
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
            
            return resource.reply({
                topicId: topicId,
                accesstoken: currentUser.accesstoken
                //accesstoken: '5447b4c3-0006-4a3c-9903-ac5a803bc17e'//currentUser.accesstoken
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
})

.factory('Storage', function($log) {

    return {
        set: function(key, data) {
            return window.localStorage.setItem(key, window.JSON.stringify(data));
        },
        get: function(key) {
            return window.JSON.parse(window.localStorage.getItem(key));
        },
        remove: function(key) {
            return window.localStorage.removeItem(key);
        }
    };
})

.factory('User', function(cfg, $resource, $log, $q, Storage) {
    var storageKey = 'user';
    var resource = $resource(cfg.api + '/accesstoken');
    var userResource = $resource(cfg.api + '/user/:loginname', {
        loginname: ''
    });
    var user = Storage.get(storageKey) || {};
    return {
        login: function(accesstoken) {
            var $this = this;
            return resource.save({
                accesstoken: accesstoken
            }, null, function(response) {
                $log.debug('post accesstoken:', response);
                user.accesstoken = accesstoken;
                $this.getByLoginName(response.loginname).$promise.then(function(r) {
                    user = r.data;
                    user.id = response.id;
                    user.accesstoken = accesstoken;

                    // set alias for jpush
                    // Push.setAlias(user.id);

                    Storage.set(storageKey, user);
                });
                user.loginname = response.loginname;
            });
        },
        logout: function() {
            user = {};
            Storage.remove(storageKey);

            // unset alias for jpush
            // Push.setAlias('');
        },
        getCurrentUser: function() {
            $log.debug('current user:', user);
            return user;
        },
        getByLoginName: function(loginName) {
            if (user && loginName === user.loginname) {
                var userDefer = $q.defer();
                $log.debug('get user info from storage:', user);
                userDefer.resolve({
                    data: user
                });
                return {
                    $promise: userDefer.promise
                };
            }
            return this.get(loginName);
        },
        get: function(loginName) {
            return userResource.get({
                loginname: loginName
            }, function(response) {
                $log.debug('get user info:', response);
                if (user && user.loginname === loginName) {
                    angular.extend(user, response.data);

                    Storage.set(storageKey, user);
                }
            });
        },
        collectTopic: function(topicId) {
            user.collect_topics.push({
                id: topicId
            });
            Storage.set(storageKey, user);
        },
        deCollectTopic: function(topicId) {
            angular.forEach(user.collect_topics, function(topic, key) {
                if (topic.id === topicId) {
                    user.collect_topics.splice(key, 1);
                }
            });
            Storage.set(storageKey, user);
        }
    };
})
