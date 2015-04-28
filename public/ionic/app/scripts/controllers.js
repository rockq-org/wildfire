angular.module('iwildfire.controllers', [])

.controller('IndexCtrl', function($scope, $rootScope,
    $stateParams,
    $ionicLoading,
    $ionicModal,
    $timeout,
    $state,
    $location,
    $log,
    Topics,
    Tabs,
    cfg
) {

    $scope.sideMenus = Tabs.getList();
    $stateParams.tab = $stateParams.tab || 'all';
    $scope.menuTitle = Tabs.getLabel($stateParams.tab);
    $scope.img_prefix = cfg.server;

    $scope.currentTab = Topics.currentTab();
    $scope.loadingMsg = '正在加载...';

    // check if tab is changed
    if ($stateParams.tab !== Topics.currentTab()) {
        $scope.currentTab = Topics.currentTab($stateParams.tab);
        // reset data if tab is changed
        Topics.resetData();
    }

    $scope.topics = Topics.getTopics();

    // pagination
    $scope.hasNextPage = Topics.hasNextPage();
    $scope.loadError = false;
    // $log.debug('page load, has next page ? ', $scope.hasNextPage);
    $scope.doRefresh = function() {
        Topics.currentTab($stateParams.tab);
        $log.debug('do refresh');
        Topics.refresh().$promise.then(function(response) {
            $log.debug('do refresh complete');
            $scope.topics = response.data;
            console.log(response.data);
            $scope.hasNextPage = true;
            $scope.loadError = false;
            if ($scope.topics.length == 0)
                $scope.loadingMsg = '附近没有二手交易信息^_^，试试其他地方吧';
            else
                $scope.loadingMsg = '下拉加载更多';
        }, $rootScope.requestErrorHandler({
            noBackdrop: true
        }, function() {
            $scope.loadError = true;
        })).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.loadMore = function() {
        $log.debug('load more');
        Topics.pagination().$promise.then(function(response) {
            $log.debug('load more complete');
            $scope.hasNextPage = false;
            $scope.loadError = false;
            $timeout(function() {
                $scope.hasNextPage = Topics.hasNextPage();
                $log.debug('has next page ? ', $scope.hasNextPage);
                if ($scope.hasNextPage == false)
                    $scope.loadingMsg = '没有新的二手交易信息^_^，试试其他地方吧';
            }, 100);
            $scope.topics = $scope.topics.concat(response.data);
        }, $rootScope.requestErrorHandler({
            noBackdrop: true
        }, function() {
            $scope.loadError = true;
        })).finally(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    $scope.changeSelected = function(item) {
        $state.go('tab.index', {
            tab: item.value
        });
        $scope.menuTitle = item.label;
        $stateParams.tab = item.value;

        $scope.currentTab = Topics.currentTab($stateParams.tab);
        $scope.doRefresh();
    }

    // if(wechat_signature){
    //     wechat_signature.jsApiList = ['getLocation'];
    //     wx.config(wechat_signature);
    //     wx.error(function(err) {
    //         alert('获取用户地理位置信息失败！'); alert(err);
    //     });
    //     wx.ready(function() {
    //         wx.getLocation({
    //             success: function(res) {

    //                 console.log( JSON.stringify( res ) );
    //                 // var locationDetail = res.detail;
    //                 // console.log(locationDetail);
    //                 // var title = '';
    //                 // console.log(res);
    //                 // $scope.tabTitle = title;
    //                 // Topics.setGeom(res);
    //                 // $scope.doRefresh();
    //             }
    //         });
    //     });
    // };

    /***********************************
     * Search
     ***********************************/
    $scope.tabTitle = '首页';
    $scope.SearchText = '搜索';
    $scope.showSearch = false;
    $scope.doSearch = function(query) {
        if (!($scope.showSearch)) {
            $scope.showSearch = true;
            $log.debug('showSearch');
            return;
        }
        $log.debug('doSearch');
        Topics.setQuery(query);
        // Topics.setGeom({lng:140,lat:40.4});
        $scope.doRefresh();
        $log.debug('searchText', query);
        $scope.tabTitle = query || '首页';
    }
    $scope.endSearch = function() {
        $scope.showSearch = false;
    }
})

.controller('ItemCtrl', function(
    $scope,
    $rootScope,
    $stateParams,
    $timeout,
    $ionicLoading,
    $ionicActionSheet,
    $ionicScrollDelegate,
    $log,
    Topics,
    Topic,
    cfg,
    User
) {
    $log.debug('topic ctrl', $stateParams);
    var id = $stateParams.itemId;
    var topic = Topics.getById(id);
    $scope.topic = topic;
    $scope.img_prefix = cfg.server;
    $scope.avatar_prefix = cfg.api + '/avatar/';

    // before enter view event
    $scope.$on('$ionicView.beforeEnter', function() {
        // track view
        if (window.analytics) {
            window.analytics.trackView('topic view');
        }
    });

    // load topic data
    $scope.loadTopic = function(reload) {
        var topicResource;
        if (reload === true) {
            topicResource = Topic.get(id);
        } else {
            topicResource = Topic.getById(id);
        }
        return topicResource.$promise.then(function(response) {
            $scope.topic = response.data;
        }, $rootScope.requestErrorHandler({
            noBackdrop: true
        }, function() {
            $scope.loadError = true;
        }));
    };
    $scope.loadTopic();

    // detect if user has collected this topic
    var currentUser = User.getCurrentUser();
    $scope.isCollected = false;
    angular.forEach(currentUser.collect_topics, function(topics) {
        if (topics.id === id) {
            $scope.isCollected = true;
        }
    });

    // do refresh
    $scope.doRefresh = function() {
        return $scope.loadTopic(true).then(function(response) {
            $log.debug('do refresh complete');
        }, function() {}).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.replyData = {
        content: ''
    };

    // save reply
    $scope.saveReply = function() {
        $log.debug('new reply data:', $scope.replyData);
        $ionicLoading.show();
        Topic.saveReply(id, $scope.replyData).$promise.then(function(response) {
            $ionicLoading.hide();
            $scope.replyData.content = '';
            $log.debug('post reply response:', response);
            $scope.loadTopic(true).then(function() {
                $ionicScrollDelegate.scrollBottom();
            });
        }, $rootScope.requestErrorHandler);
    };

    // show actions
    $scope.showActions = function(reply) {
        var currentUser = User.getCurrentUser();
        if (currentUser.loginname === undefined || currentUser.loginname === reply.author.loginname) {
            return;
        }
        $log.debug('action reply:', reply);
        var upLabel = '赞';
        // detect if current user already do up
        if (reply.ups.indexOf(currentUser.id) !== -1) {
            upLabel = '已赞';
        }
        var replyContent = '@' + reply.author.loginname;
        $ionicActionSheet.show({
            buttons: [{
                text: '回复'
            }, {
                text: upLabel
            }],
            titleText: replyContent,
            cancel: function() {},
            buttonClicked: function(index) {

                // reply to someone
                if (index === 0) {
                    $scope.replyData.content = replyContent + ' ';
                    $scope.replyData.reply_id = reply.id;
                    $timeout(function() {
                        document.querySelector('.reply-new input').focus();
                    }, 1);
                }

                // up reply
                if (index === 1) {
                    Topic.upReply(reply.id).$promise.then(function(response) {
                        $log.debug('up reply response:', response);
                        $ionicLoading.show({
                            noBackdrop: true,
                            template: response.action === 'up' ? '点赞成功' : '点赞已取消',
                            duration: 1000
                        });
                    }, $rootScope.requestErrorHandler({
                        noBackdrop: true,
                    }));
                }
                return true;
            }
        });
    };

    // collect topic
    $scope.collectTopic = function() {
        if ($scope.isCollected) {
            Topic.deCollectTopic(id).$promise.then(function(response) {
                if (response.success) {
                    $scope.isCollected = false;
                    User.deCollectTopic(id);
                }
            });
        } else {
            Topic.collectTopic(id).$promise.then(function(response) {
                if (response.success) {
                    $scope.isCollected = true;
                    User.collectTopic(id);
                }
            });
        }
    };
})

/**
 * create Goods item in backend
 * Implementation: https://github.com/arrking/wildfire/issues/17
 * Task: https://github.com/arrking/wildfire/issues/55
 * Depend API: https://github.com/arrking/wildfire/issues/53
 * @param  {[type]} $scope           [description]
 * @param  {[type]} $log             [description]
 * @param  {[type]} wechat_signature [description]
 * @return {[type]}                  [description]
 */
.controller('PostCtrl', function($scope, $state,
    $stateParams,
    $ionicModal,
    $timeout,
    $log,
    $q,
    cfg,
    store,
    webq,
    wxWrapper,
    Tabs) {

    // #TODO comment out for debugging
    // if not contains profile and accesstoken, just naviagte
    // to user authentication page.
    // if (!store.getAccessToken()) {
    //     window.location.href = '{0}/auth/wechat/embedded'.f(cfg.server);
    // }
    $scope.locationDetail = {};
    $scope.params = {
        // 标题5到10个字
        title: null,
        content: null,
        tab: null,
        quality: null,
        goods_pics: [],
        goods_pre_price: null,
        goods_now_price: null,
        goods_is_bargain: true,
        // dummy data
        goods_exchange_location: {
            user_add_txt: null,
            address: null,
            lat: null, // latitude
            lng: null // longitude
        },
        goods_status: '在售'
    };

    $scope.pageModel = {};
    $scope.pageModel.tagValue = 'books';
    $scope.pageModel.quality = '全新';

    $scope.tagList = _.filter(Tabs.getList(), function(x) {
        return x.value !== 'all';
    });

    $scope.qualityList = ['全新', '很新', '完好', '适用', '能用'];

    $scope.changeTab = function(value) {
        $scope.params.tab = value;
        $log.debug('params: {0}'.f(JSON.stringify($scope.params)));
    };

    $scope.changeQuality = function(value) {
        $scope.params.quality = value;
        $log.debug('params: {0}'.f(JSON.stringify($scope.params)));
    }

    /**
     * upload wechat images in loop
     * must be called after wx ready and the
     * jsApiList has uploadImage.
     * @param  {[type]} resIds [description]
     * @return {[type]}        [description]
     */
    function _processWxImages(resIds, results, deferred) {
        try {
            if (!results) {
                results = [];
            }
            var resId = resIds.pop();
            if (resId) {
                wxWrapper.uploadImage({
                    localId: resId, // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function(res) {
                        results.push(res.serverId); // 返回图片的服务器端ID
                        _processWxImages(resIds, results, deferred);
                    }
                });
            } else {
                deferred.resolve(results);
            }
        } catch (e) {
            deferred.reject(e);
        }
    }

    $scope.uploadImage = function() {
        // setup weixin sdk
        // http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#JSSDK.E4.BD.BF.E7.94.A8.E6.AD.A5.E9.AA.A4

        // check if wxWrapper exists or not.
        if (!wxWrapper)
            return;

        wxWrapper.chooseImage({
            success: function(res) {
                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                // can not upload multi-images at the same time.
                var deferred = $q.defer();
                _processWxImages(localIds, null, deferred);
                deferred.promise.then(function(data) {
                        /**
                         * data is the serverIds array
                         * ServerIds can be used to download
                         * images from wechat server to local
                         * server, by default, the images are
                         * expired in three days.
                         * http://mp.weixin.qq.com/wiki/12/58bfcfabbd501c7cd77c19bd9cfa8354.html
                         * @param  {[type]} err [description]
                         * @return {[type]}     [description]
                         */
                        return webq.uploadWechatImages(data)
                    }, function(err) {
                        alert(JSON.stringify(err));
                    })
                    .then(function(result) {
                        // alert('succ:' + JSON.stringify(result));
                        _.each(result, function(value, index) {
                            // insert the image url into goods metadata
                            $scope.params.goods_pics.push(value.imageUrl);
                        });

                    }, function(err) {
                        alert('fail:' + JSON.stringify(err));
                    });
            }
        });

    };

    // testSetupLocation();
    // function testSetupLocation(){
    //     $scope.locationDetail = {
    //         address: '',
    //         user_add_txt: '',
    //         latitude: '39.916527',
    //         longitude: '116.397128'
    //     };
    //     $ionicModal.fromTemplateUrl('templates/modal-change-location.html', {
    //         scope: $scope
    //     }).then(function(modal) {
    //         $scope.modal-change-location = modal;
    //         // modal.show();
    //     });
    // }

    $scope.closeChangeLocationModal = function(isSubmit) {
        if (isSubmit) {
            $timeout(function() {
                $scope.params.goods_exchange_location.address = $scope.locationDetail.address;
                $scope.params.goods_exchange_location.user_add_txt = $scope.locationDetail.user_add_txt;
                $scope.params.goods_exchange_location.lat = $scope.locationDetail.latitude;
                $scope.params.goods_exchange_location.lng = $scope.locationDetail.longitude;
                console.log($scope.params.goods_exchange_location);
            });
        }
        $scope.changeLocationModal.hide();
    }

    initGoodsExchangeLocation();

    function initGoodsExchangeLocation() {
        // check if wxWrapper exists or not.
        if (!wxWrapper)
            return;

        wxWrapper.getLocation({
            success: function(res) {
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                var speed = res.speed; // 速度，以米/每秒计
                var accuracy = res.accuracy; // 位置精度

                $scope.locationDetail = {
                    address: '',
                    user_add_txt: '',
                    latitude: latitude,
                    longitude: longitude
                };

                // Create the modal that we will use later
                $ionicModal.fromTemplateUrl('templates/modal-change-location.html', {
                    scope: $scope
                }).then(function(modal) {
                    $scope.changeLocationModal = modal;
                    // modal.show();
                });
            }
        });
    }

    /**
     * 验证表单字段
     */
    function validateForm(params) {
        return !_.some([params.title, params.content, params.tab,
            params.quality, params.goods_pre_price, params.goods_now_price
        ], function(x) {
            return (x == null) || (x == '');
        });
    }

    /**
     * 提交二手物品创建信息
     * @return {[type]} [description]
     */
    $scope.submitGoods = function() {
        // validate data
        if (validateForm($scope.params)) {
            webq.createNewGoods($scope.params)
                .then(function(result) {
                    /**
                     * success: true
                     * topic_id: xxxx
                     * @param  {[type]} result.success [description]
                     * @return {[type]}                [description]
                     */
                    if (result.success) {
                        // create record successfully.
                        alert('创建成功！');
                        // #TODO navigate to detail page.
                        $state.go('item', {
                            itemId: result.topic_id
                        });
                    } else {
                        // fail to create record.
                        alert('创建失败！');
                    }
                }, function(err) {
                    $log.error(err);
                    alert(err.error_msg);
                });
        } else {
            alert('缺少信息。')
        }
    }


    /*******************************************
     * Modal View to input description of goods
     *******************************************/
    $ionicModal.fromTemplateUrl('templates/modal-post-goods-desp.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.GoodsDespModal = modal;
    });

    $scope.openGoodsDespModal = function() {
        $scope.GoodsDespModal.show();
    };
    $scope.closeGoodsDespModal = function() {
        $scope.GoodsDespModal.hide();
    };

    /*******************************************
     * End of Modal View to input description of goods
     *******************************************/

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {

        if ($scope.GoodsDespModal)
            $scope.GoodsDespModal.remove();

        if ($scope.changeLocationModal)
            $scope.changeLocationModal.remove()
    });

})

.controller('MapsCtrl', function($scope) {})

.controller('InboxCtrl', function($scope, Messages) {
    $scope.messages = Messages.all();
    $scope.remove = function(message) {
        Messages.remove(message);
    }
})

.controller('InboxDetailCtrl', function($scope, $stateParams, Messages) {
    $scope.items = [{
        id: 0,
        price: '￥ 1000.00 （含运费0.00元）',
        desc: '交易前聊一聊',
        img: 'templates/tab-inbox-imgs/1.jpg'
    }];
    var userId = '00002'
    $scope.itemClass = function(item) {
        var itemClass = 'item-remove-animate item-avatar chat';
        if (item.userId == userId) {
            itemClass = 'item-remove-animate item-avatar-right chat  chat-right';
        }
        return itemClass;
    }
    $scope.messages = Messages.all();
})

.controller('AccountCtrl', function($scope, $ionicModal, $log, store, cfg,
    webq, myProfile, myTopics) {
    $log.debug("myProfile" + JSON.stringify(myProfile));
    $log.debug("myTopics: " + JSON.stringify(myTopics));
    // load user profile from localStorage
    var onGoingStuffs = [];
    var offShelfStuffs = [];
    var favoritesStuffs = [];

    if (!myProfile && !cfg.debug) {
        // change to wechat uaa page
        window.location = '{0}/auth/wechat/embedded'.f(cfg.server);
        // Just to avoid myProfile = null
        // In that case, the script would throw an error. Even
        // it does not crash the app, but it is not friendly.
        myProfile = {};
    } else if (cfg.debug) {
        // ensure dummy data for local debugging
        myProfile = {};
    }

    /**
     * Separate topics into each category
     * @param  {[boolean]} update whether fetch data from backend
     * @return {[type]}          [description]
     */
    function _separateMyTopics(update, callback) {
        if (update) {
            webq.getMyTopicsResolve()
                .then(function(latestMyTopics) {
                    if (latestMyTopics) {
                        myTopics = latestMyTopics;
                        onGoingStuffs = _.filter(myTopics, function(x) {
                            return x.goods_status === '在售';
                        });

                        offShelfStuffs = _.filter(myTopics, function(x) {
                            return x.goods_status === '下架';
                        });

                        favoritesStuffs = _.filter(myTopics, function(x) {
                            return x.goods_status === '收藏';
                        });
                        if (callback) callback();
                    }
                });
        } else if (myTopics) {
            onGoingStuffs = _.filter(myTopics, function(x) {
                return x.goods_status === '在售';
            });

            offShelfStuffs = _.filter(myTopics, function(x) {
                return x.goods_status === '下架';
            });

            // #Todo Issue 78
            // https://github.com/arrking/wildfire/issues/78
            favoritesStuffs = _.filter(myTopics, function(x) {
                return x.goods_status === '收藏';
            });
            if (callback) callback();
        }
    }

    function _resetScopeData() {
        $scope.data = {
            name: myProfile.name || '未登录' /* the default values for debugging usage.*/ ,
            avatar: myProfile.avatar || 'images/dummy/avatar.jpg',
            phone: myProfile.phone_number || '未绑定',
            title: '我的呱呱',
            onGoingStuffs: onGoingStuffs,
            onGoingStuffsBadge: onGoingStuffs.length,
            offShelfStuffs: offShelfStuffs,
            offShelfStuffsBadge: offShelfStuffs.length,
            favoritesStuffs: favoritesStuffs,
            favoritesStuffsBadge: favoritesStuffs.length,
            // by default, render 在售 as content
            stuffs: onGoingStuffs
        };
    }

    _separateMyTopics();
    _resetScopeData();

    $scope.onTabSelected = function(category) {
        switch (category) {
            case 'onGoingStuffs':
                _separateMyTopics(true, function() {
                    $scope.stuffs = onGoingStuffs;
                    _resetScopeData();
                });
                break;
            case 'offShelfStuffs':
                _separateMyTopics(true, function() {
                    $scope.stuffs = offShelfStuffs;
                    _resetScopeData();
                });
                break;
            case 'favoritesStuffs':
                _separateMyTopics(true, function() {
                    $scope.stuffs = favoritesStuffs;
                    _resetScopeData();
                });
                break;
            default:
                break;
        }
    }

    /**
     * 顶
     * 更新topic的 update_at 值
     * @param  {[type]} topic [description]
     * @return {[type]}       [description]
     */
    $scope.editDingOnShelf = function(topic) {
        webq.dingMyTopic(topic)
            .then(function() {
                alert('恭喜，成功置顶！');
            }, function() {
                alert('没有成功，什么情况，稍候再试 ?');
            });
    }

    /**
     * 下架
     * tab: onGoingStuffs
     * @param  {[type]} topic [description]
     * @return {[type]}       [description]
     */
    $scope.editOffShelf = function(topic) {
        $log.debug('profile: {0} 下架'.f(topic.title));
        topic.goods_status = '下架';
        webq.updateMyTopic(topic)
            .then(function(data) {
                // alert('{0} 成功下架'.f(topic.title));
                _separateMyTopics(true, function() {
                    $scope.stuffs = onGoingStuffs;
                    _resetScopeData();
                });
            }, function(err) {
                alert(JSON.stringify(err));
            });
    }

    /**
     * 售出
     * tab: onGoingStuffs
     * @param  {[type]} topic [description]
     * @return {[type]}       [description]
     */
    $scope.editSoldOut = function(topic) {
        $log.debug('profile: {0} 售出'.f(topic.title));
        topic.goods_status = '售出';
        webq.updateMyTopic(topic)
            .then(function(data) {
                // alert('{0} 成功下架'.f(topic.title));
                _separateMyTopics(true, function() {

                    $scope.stuffs = onGoingStuffs;
                    _resetScopeData();
                });
            }, function(err) {
                alert(JSON.stringify(err));
            });
    }

    /**
     * 删除
     * tab: offShelfStuffs
     * @param  {[type]} topic [description]
     * @return {[type]}       [description]
     */
    $scope.editDelete = function(topic) {
        $log.debug('profile: {0} 删除'.f(topic.title));
        topic.deleted = true;
        webq.updateMyTopic(topic)
            .then(function(data) {
                // alert('{0} 成功下架'.f(topic.title));
                _separateMyTopics(true, function() {
                    $scope.stuffs = offShelfStuffs;
                    _resetScopeData();
                });
            }, function(err) {
                alert(JSON.stringify(err));
            });
    }

    /**
     * 上架
     * tab: offShelfStuffs
     * @param  {[type]} topic [description]
     * @return {[type]}       [description]
     */
    $scope.editOnShelf = function(topic) {
        $log.debug('profile: {0} 上架'.f(topic.title));
        topic.goods_status = '在售';
        webq.updateMyTopic(topic)
            .then(function(data) {
                // alert('{0} 成功下架'.f(topic.title));
                _separateMyTopics(true, function() {
                    $scope.stuffs = offShelfStuffs;
                    _resetScopeData();
                });
            }, function(err) {
                alert(JSON.stringify(err));
            });
    }

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.settingsModal.remove();
    });
})

.controller('BindMobilePhoneCtrl', function($scope, $state, $stateParams,
    $ionicPopup, $ionicLoading, $timeout, $log, webq, store) {
    var phonenoPattern = /^\(?([0-9]{11})\)?$/;
    var accessToken = $stateParams.accessToken;
    store.setAccessToken(accessToken);
    var currentPhoneNumber;

    $scope.data = {
        phoneNumber: null,
        verifyCode: null
    };

    // JavaScript to validate the phone number
    function isPhonenumber(val) {
        if (val.match(phonenoPattern)) {
            return true;
        } else {
            return false;
        }
    }

    function _showLoadingSpin(txt, callback) {
        $ionicLoading.show({
            template: txt
        });
        callback();
    };

    function _hideLoadingSpin() {
        $ionicLoading.hide();
    };

    function _fixPhoneNumberInputPlaceholder(txt) {
        $scope.data.phoneNumber = null;
        angular.element(document.getElementById('phoneNumber')).attr('placeholder', txt);
    }

    function _fixVerifyCodeInputPlaceholder(txt) {
        $scope.data.verifyCode = null;
        angular.element(document.getElementById('verifyCode')).attr('placeholder', txt);
    }

    $scope.sendVerifyCode = function() {
        // verify the input nubmer is a phone number
        // alert('sendVerifyCode' + JSON.stringify($scope.data));
        if ($scope.data.phoneNumber &&
            isPhonenumber($scope.data.phoneNumber)) {
            // user has input a phone number
            // post request to send the api
            currentPhoneNumber = $scope.data.phoneNumber;
            _showLoadingSpin('发送验证码 ...', function() {
                webq.sendVerifyCode($scope.data.phoneNumber)
                    .then(function(result) {
                        // send code sucessfully, just close loading
                        // spin in finally.
                        _fixPhoneNumberInputPlaceholder('已发送至 {0}.'.f($scope.data.phoneNumber));
                    }, function(err) {
                        // get an error, now alert it.
                        // TODO process err in a user friendly way.
                        alert(JSON.stringify(err));
                    })
                    .finally(function() {
                        _hideLoadingSpin();
                    });
            });
            // $timeout(function(){
            //  _hideLoadingSpin();
            // }, 3000);
        } else {
            // validate failed.
            _fixPhoneNumberInputPlaceholder('输入正确的手机号码');
        }
    }

    $scope.bindPhoneNumber = function() {
        if ($scope.data.verifyCode && $scope.data.verifyCode.length == 4) {
            // check the verify code
            _showLoadingSpin('验证中 ...', function() {
                webq.checkVerifyCode(currentPhoneNumber, $scope.data.verifyCode)
                    .then(function(result) {
                        // register successfully.
                        if (result.user) {
                            store.setUserProfile(result.user);
                        }
                        $state.go('tab.index');
                    }, function(err) {
                        _fixVerifyCodeInputPlaceholder('验证码错误，重新输入');
                    })
                    .finally(function() {
                        _hideLoadingSpin();
                    });
            });
        } else {
            // error
            _fixVerifyCodeInputPlaceholder('验证码格式不正确，重新输入');
        }
    }
})

/**
 * Add loading spinner when requesting user profile
 * @IMPORTANT@ the accesstoken is passed in here.
 * @param  {[type]} $log           [description]
 * @param  {[type]} $stateParams   [description]
 * @param  {[type]} $scope         [description]
 * @param  {[type]} $ionicLoading) {               } [description]
 * @return {[type]}                [description]
 */
.controller('BindAccessTokenCtrl', function($log, $stateParams,
    $scope,
    $state,
    store) {
    var accesstoken = $stateParams.accessToken;
    $log.debug('Get accesstoken ' + accesstoken);
    if (accesstoken) {
        store.setAccessToken($stateParams.accessToken);
    }
    $state.go('tab.index');
})

.controller('SettingsCtrl', function($log, $scope,
    $timeout,
    $state,
    store,
    webq) {
    $log.debug('SettingsCtrl ...');


    // resolve user phone
    function _getUserPhone() {
        var userProfile = store.getUserProfile();
        if (userProfile) {
            return userProfile.phone_number;
        }
        return '未绑定';
    }


    $scope.data = {
        feedback: {
            title: '我要吐槽',
            content: ''
        },
        phone: _getUserPhone()
    };

    $scope.goBackProfile = function() {
        $state.go('tab.account');
    }

    $scope.goBackSettings = function() {
        $state.go('settings');
    }

    $scope.submitFeedback = function() {
        $log.debug('feedbackTxt:' + $scope.data.feedback.content);
        if ($scope.data.feedback.content) {
            webq.submitFeedback($scope.data.feedback.content)
                .then(function() {
                    alert('感谢您对我们的支持，一直在努力，不放弃治疗。');
                    $scope.goBackSettings();
                }, function() {
                    alert('吐槽失败，看来是槽点太多。');
                });
        } else {
            $scope.data.feedback.title = '反馈内容不可为空';
            $timeout(function() {
                $scope.data.feedback.title = '我要吐槽';
            }, 3000);
        }
    }

    if ($state.is('service-agreement')) {
        webq.getUserServiceAgreements()
            .then(function(data) {
                $scope.data.service_agreements = data;
            }, function(err) {
                $scope.data.service_agreements = '服务器抽疯了，木有返回数据。';
            });
    }
})

;
