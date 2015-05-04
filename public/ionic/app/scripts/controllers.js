angular.module('iwildfire.controllers', [])

.controller('IndexCtrl', function($scope, $rootScope,
    $stateParams,
    $ionicLoading,
    $ionicModal,
    $ionicPopup,
    $timeout,
    $state,
    locationDetail,
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
    $scope.loadingMsg = '正在获取您的位置...';

    //cheat solution
    function loadDataAfterGetLocation() {
        $scope.loadingMsg = '正在搜索您附近得二手信息...';
        // check if tab is changed
        if ($stateParams.tab !== Topics.currentTab()) {
            $scope.currentTab = Topics.currentTab($stateParams.tab);
            // reset data if tab is changed
            console.log('reset Data');
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
                console.log(JSON.stringify(response.data));
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
                        $scope.loadingMsg = '附近没有新的二手交易信息^_^，试试其他地方吧';

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
    }

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
        $scope.showSearch = false;
        Topics.setQuery(query);
        // Topics.setGeom({lng:140,lat:40.4});
        $scope.doRefresh();
        $log.debug('searchText', query);
        $scope.tabTitle = query || '首页';
    }
    $scope.showAddress = function() {
        var popup = $ionicPopup.alert({
            title: '当前位置',
            template: $scope.tabTitle
        })
    }

    $scope.collectTopic = function( topic ) {
        topic.collect_count--;
    }

    if (typeof(locationDetail) != 'undefined') {
        console.log('lyman 122', JSON.stringify(locationDetail));
        $scope.address = locationDetail.user_edit_address;
        $scope.tabTitle = locationDetail.user_edit_address;
        Topics.setGeom(locationDetail);
        loadDataAfterGetLocation();
    } else {
        // load pages from local browser for debugging
        loadDataAfterGetLocation();
    };

})



.controller('MapsCtrl', function(
    $scope,
    $rootScope,
    $stateParams,
    $ionicLoading,
    $ionicModal,
    $ionicPopup,
    $timeout,
    $state,
    webq,
    locationDetail,
    $location,
    $log,
    Topics,
    Tabs,
    cfg
) {
    // locationDetail = {
    //     api_address: '仙游',
    //     user_edit_address: '仙游',
    //     lat: 25.3518140000000010,
    //     lng: 118.7042859999999962
    // };
    // $scope.locationDetail = locationDetail;

    $scope.sideMenus = Tabs.getList();
    $stateParams.tab = $stateParams.tab || 'all';
    $scope.menuTitle = Tabs.getLabel($stateParams.tab);
    $scope.img_prefix = cfg.server;

    $scope.currentTab = Topics.currentTab();

    $scope.changeSelected = function(item) {
        $state.go('tab.maps', {
            tab: item.value
        });
        $scope.menuTitle = item.label;
        $stateParams.tab = item.value;

        $scope.currentTab = Topics.currentTab($stateParams.tab);
        $scope.doRefresh();
    }

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
        $scope.showSearch = false;
        Topics.setQuery(query);
        // Topics.setGeom({lng:140,lat:40.4});
        $scope.doRefresh();
        $log.debug('searchText', query);
        $scope.tabTitle = query || '首页';
    }
    $scope.showAddress = function() {
        var popup = $ionicPopup.alert({
            title: '当前位置',
            template: $scope.tabTitle
        });
    }

    function loadDataAfterGetLocation() {
        $scope.loadingMsg = '正在搜索您附近得二手信息...';
        if ($stateParams.tab !== Topics.currentTab()) {
            $scope.currentTab = Topics.currentTab($stateParams.tab);
            Topics.resetData();
        }

        $scope.topics = Topics.getTopics();
        $scope.loadError = false;
        $scope.doRefresh = function() {
            Topics.currentTab($stateParams.tab);
            $log.debug('do refresh');
            Topics.refresh().$promise.then(function(response) {
                $scope.topics = response.data;
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
                        $scope.loadingMsg = '附近没有新的二手交易信息^_^，试试其他地方吧';

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
    }

    if (typeof(locationDetail) != 'undefined') {
        console.log('get location from resolve now!', JSON.stringify(locationDetail));
        $scope.address = locationDetail.user_edit_address;
        $scope.tabTitle = locationDetail.user_edit_address;
        Topics.setGeom(locationDetail);
        $scope.locationDetail = locationDetail;
    } else {
        // load pages from local browser for debugging
        loadDataAfterGetLocation();
        $scope.doRefresh();
    };


    $scope.map = {
        center: {
            lat: locationDetail.lat,
            lng: locationDetail.lng
        },
        zoom: 13
    };

    $scope.$watchCollection('locationDetail', function(newValue, oldValue) {
        $scope.address = $scope.locationDetail.user_edit_address;
        $scope.tabTitle = $scope.locationDetail.user_edit_address;
        Topics.setGeom($scope.locationDetail);
        loadDataAfterGetLocation();
        $scope.doRefresh();
    });

    $scope.showFullAddress = function() {
        console.log($scope.locationDetail.api_address);
        var alertPopup = $ionicPopup.alert({
            title: '',
            template: $scope.locationDetail.api_address
        });
    }
})

.controller('ItemCtrl', function(
    $scope,
    $rootScope,
    $stateParams,
    $timeout,
    $ionicLoading,
    $ionicPopup,
    $ionicActionSheet,
    $ionicScrollDelegate,
    $ionicSlideBoxDelegate,
    $log,
    Topics,
    Topic,
    store,
    cfg,
    User
) {
    $log.debug('topic ctrl', $stateParams);
    var id = $stateParams.itemId;
    var topic = Topics.getById(id);
    $scope.topic = topic;
    $scope.img_prefix = cfg.server;
    $scope.avatar_prefix = cfg.api + '/avatar/';
    $scope.showBargains = true;
    $scope.status = 'normal';
    $scope.currentLocation = store.getLocationDetail();

    // before enter view event
    $scope.$on('$ionicView.beforeEnter', function() {
        // track view
        if (window.analytics) {
            window.analytics.trackView('topic view');
        }
    });
    $scope.$on('$ionicView.afterLeave', function() {
        $scope.showBargains = false;
        $scope.status = 'normal';
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
            $ionicSlideBoxDelegate.update();
            $scope.isCollected = $scope.topic.in_collection;
            $scope.replies = [];
            $scope.bargains = [];
            $scope.topic.replies.forEach(function(item, i) {
                if (item.price) $scope.bargains.push(item);
                else $scope.replies.push(item);
            })
            console.log($scope.topic);
            console.log($scope.bargains);
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


    // check if the current login or not.
    // popup the login options if not.
    $scope.isShownReplyInputBox = function() {
        if (!currentUser) {
            $log.warn('isShownReplyInputBox', 'none logged in.');
            $scope.showReply = false;
            // popup the selection to bring the
            // user into login page.
            // A confirm dialog
            $ionicPopup.confirm({
                    title: '提示',
                    template: '仅登陆用户可以回复内容，带我去微信认证登陆？',
                    cancelText: '残忍拒绝',
                    okText: '是'
                })
                .then(function(res) {
                    if (res) {
                        window.location.href = '{0}/auth/wechat/embedded'.f(cfg.server);
                    } else {
                        $log.debug('user choose not login.');
                    }
                });
        } else {
            $scope.showReply = true;
        }
    }

    $scope.bargain = function() {
        /*
                if ($scope.topic.goods_is_bargain == false){
                    var popup = $ionicPopup.alert({
                        title: '对不起',
                        template: '次商品不接受砍价'
                    });
                    return;
                }*/
        var popup = $ionicPopup.show({
            template: '出价&nbsp;&nbsp;&nbsp;￥<input type="text" ng-model="replyData.price">\
                        说点什么<input type="text" ng-model="replyData.content">',
            title: '我要出价',
            subTitle: '价格要厚道',
            scope: $scope,
            buttons: [{
                text: '取消'
            }, {
                text: '<b>出价</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.replyData.content) {
                        //don't allow the user to close unless he enters wifi password
                        e.preventDefault();
                    } else {
                        $ionicLoading.show();
                        Topic.saveReply(id, $scope.replyData).$promise.then(function(response) {
                            $ionicLoading.hide();
                            $scope.replyData.content = '';
                            $log.debug('post reply response:', response);
                            $scope.loadTopic(true).then(function() {
                                $ionicScrollDelegate.scrollBottom();
                            });
                        }, $rootScope.requestErrorHandler);
                    }
                }
            }]
        });
        popup.then(function(res) {
            console.log('Tapped!', res);
        });
    }

    $scope.comment = function() {
        var popup = $ionicPopup.show({
            template: '<input type="text" ng-model="replyData.content">',
            title: '我要留言',
            subTitle: '说点什么吧',
            scope: $scope,
            buttons: [{
                text: '取消'
            }, {
                text: '<b>留言</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.replyData.content) {
                        //don't allow the user to close unless he enters wifi password
                        e.preventDefault();
                    } else {
                        $ionicLoading.show();
                        Topic.saveReply(id, $scope.replyData).$promise.then(function(response) {
                            $ionicLoading.hide();
                            $scope.replyData.content = '';
                            $log.debug('post reply response:', response);
                            $scope.loadTopic(true).then(function() {
                                $ionicScrollDelegate.scrollBottom();
                            });
                        }, $rootScope.requestErrorHandler);
                    }
                }
            }]
        });
        popup.then(function(res) {
            console.log('Tapped!', res);
        });
    }

    // save reply
    $scope.saveReply = function() {
        $log.debug('new reply data:', JSON.stringify($scope.replyData));
        if ($scope.replyData.content == '') return $scope.showReply = false;
        $ionicLoading.show();
        Topic.saveReply(id, $scope.replyData).$promise.then(function(response) {
            $ionicLoading.hide();
            $scope.replyData = {
                content: ''
            };
            $log.debug('post reply response:', response);
            $scope.loadTopic(true).then(function() {
                $ionicScrollDelegate.scrollBottom();
            });
            $scope.showReply = false;
        }, $rootScope.requestErrorHandler);
    };

    // collect topic
    $scope.collectTopic = function() {
        if ($scope.isCollected) {
            Topic.deCollectTopic(id).$promise.then(function(response) {
                if (response.success) {
                    $scope.isCollected = false;
                    if( !$scope.topic.collect_count ){
                        $scope.topic.collect_count = 1;
                    }
                    $scope.topic.collect_count = parseInt($scope.topic.collect_count) - 1;
                    User.deCollectTopic(id);
                }
            });
        } else {
            Topic.collectTopic(id).$promise.then(function(response) {
                if (response.success) {
                    $scope.isCollected = true;
                    if( !$scope.topic.collect_count ){
                        $scope.topic.collect_count = 0;
                    }
                    $scope.topic.collect_count = parseInt($scope.topic.collect_count) + 1;
                    User.collectTopic(id);
                }
            });
        }
    };

     // for complian topic
    $scope.complainTopic = function( topic ) {
        $scope.popupData = {};
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
                            template: '<textarea autofocus ng-model="popupData.complainDescription" placeholder="您的举报理由" style="height:120px"></textarea>',
                            title: '举报商品',
                            // subTitle: '请输入您的举报理由',
                            scope: $scope,
                            buttons: [
                              { text: '取消' },
                              {
                                text: '<b>提交</b>',
                                type: 'button-assertive',
                                onTap: function(e) {
                                  if (!$scope.popupData.complainDescription) {
                                    //don't allow the user to close unless he enters wifi password
                                    e.preventDefault();
                                  } else {
                                    return $scope.popupData.complainDescription;
                                  }
                                }
                              }
                            ]
                        });

        myPopup.then(function(description) {
            if( description ) {
                $scope.showLoading('提交中，请稍候！');
                Topic.complainTopic(topic.id, description ).$promise.then(function(response){
                    $scope.hideLoading();
                });
            }
        });
    }
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
    $ionicPopup,
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
    if (!store.getAccessToken()) {
        window.location.href = '{0}/auth/wechat/embedded?redirect={1}'.f(cfg.server, encodeURIComponent('{0}/#/tab/account'.f(cfg.server)));
    }

    // $scope.params = {
    //     // 标题5到10个字
    //     title: null,
    //     content: null,
    //     tab: null,
    //     quality: null,
    //     goods_pics: ['http://img1.cache.netease.com/catchpic/9/95/95C6FAC0DC54FC2D8BFFE30EE14990DD.jpg',
    //         'http://img1.cache.netease.com/catchpic/9/95/95C6FAC0DC54FC2D8BFFE30EE14990DD.jpg'],
    //     goods_pre_price: null,
    //     goods_now_price: null,
    //     goods_is_bargain: true,
    //     // dummy data
    //     goods_exchange_location: {
    //         user_edit_address: null,
    //         api_address: null,
    //         lat: null, // latitude
    //         lng: null // longitude
    //     },
    //     goods_status: '在售'
    // };

    // #Todo this is dummy data for debugging
    $scope.params = {
        // 标题5到10个字
        title: 'testtitle',
        content: 'test contenet',
        tab: 'electronics',
        quality: '全新',
        goods_pics: [],
        goods_pre_price: null,
        goods_now_price: null,
        goods_is_bargain: true,
        // dummy data
        goods_exchange_location: {
            user_edit_address: null,
            api_address: null,
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

    /**
     * 删除 goods pic
     *
     * @param  {[type]} srcValue [description]
     * @return {[type]}          [description]
     */
    $scope.removeGoodsPic = function(srcValue) {
        // A confirm dialog
        var confirmPopup = $ionicPopup.confirm({
            title: '提示',
            template: '确定删除这张配图?',
            okText: '是',
            okType: 'button-balanced',
            cancelText: '否',
            cancelType: 'button-default'
        });
        confirmPopup.then(function(res) {
            if (res) {
                $scope.params.goods_pics = _.filter($scope.params.goods_pics,
                    function(x) {
                        return x !== srcValue;
                    });

                $log.debug('Goods Pics ' + JSON.stringify($scope.params.goods_pics));
            } else {
                // cancelled
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
        console.log('lyman 565 submitGoods');
        if (validateForm($scope.params)) {
            console.log('lyman 567 done with validateForm');

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
                    console.log('lyman 566', JSON.stringify(err));
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

    /*******************************************
     * Modal View to input detail of exchange location
     *******************************************/

    /**
     * Store the exchange location information
     * @type {Object}
     */
    webq.getLocationDetail(wxWrapper)
        .then(function(data) {
            $log.debug('locationDetail', JSON.stringify(data));
            $scope.locationDetail = data;
            $scope.params.goods_exchange_location = data;
            $scope.showEdit = false;
            // Create the modal that we will use later
            $ionicModal.fromTemplateUrl('templates/modal-change-location.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.changeLocationModal = modal;
                // modal.show();
            });

            $scope.closeChangeLocationModal = function(isSubmit) {
                if (isSubmit) {
                    $timeout(function() {
                        $scope.params.goods_exchange_location.api_address = $scope.locationDetail.api_address;
                        $scope.params.goods_exchange_location.user_edit_address = $scope.locationDetail.user_edit_address;
                        $scope.params.goods_exchange_location.lat = $scope.locationDetail.lat;
                        $scope.params.goods_exchange_location.lng = $scope.locationDetail.lng;
                        console.log('lyman 498', JSON.stringify($scope.locationDetail));
                        console.log('lyman 499', JSON.stringify($scope.params.goods_exchange_location));
                    });
                }
                $scope.changeLocationModal.hide();
            }
        });
    /*******************************************
     * End Modal View to input detail of exchange location
     *******************************************/

    $scope.showFullAddress = function() {
        console.log($scope.locationDetail.api_address);
        var alertPopup = $ionicPopup.alert({
            title: '',
            template: $scope.locationDetail.api_address
        });
    }

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {

        if ($scope.GoodsDespModal)
            $scope.GoodsDespModal.remove();

        if ($scope.changeLocationModal)
            $scope.changeLocationModal.remove()
    });

})

.controller('InboxCtrl', function($scope, Messages, $log, $rootScope) {
    Messages.getMessages().$promise.then(function(response) {
        $scope.messages = response.data;
        //console.log(JSON.stringify($scope.messages));
        if ($scope.messages.hasnot_read_messages.length === 0) {
            $rootScope.$broadcast('messagesMarkedAsRead');
        } else {
            Messages.markAll().$promise.then(function(response) {
                $log.debug('mark all response:', response);
                if (response.success) {
                    $rootScope.$broadcast('messagesMarkedAsRead');
                }
            }, function(response) {
                $log.debug('mark all response error:', response);
            });
        }
    }, function(response) {
        $log.debug('get messages response error:', response);
    });
})

// .controller('InboxDetailCtrl', function($scope, $stateParams, Messages) {
//     $scope.items = [{
//         id: 0,
//         price: '￥ 1000.00 （含运费0.00元）',
//         desc: '交易前聊一聊',
//         img: 'templates/tab-inbox-imgs/1.jpg'
//     }];
//     var userId = '00002'
//     $scope.itemClass = function(item) {
//         var itemClass = 'item-remove-animate item-avatar chat';
//         if (item.userId == userId) {
//             itemClass = 'item-remove-animate item-avatar-right chat  chat-right';
//         }
//         return itemClass;
//     }
//     $scope.messages = Messages.all();
// })

.controller('AccountCtrl', function($scope, $ionicModal, $log, store, cfg,
    webq, myProfile, myTopics, $q, Topic) {
    $log.debug("myProfile" + JSON.stringify(myProfile));
    $log.debug("myTopics: " + JSON.stringify(myTopics));
    // load user profile from localStorage
    var onGoingStuffs = [];
    var offShelfStuffs = [];
    var favoritesStuffs = [];
    $scope.isFavoriteTab = false;

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
            $q.all([
              webq.getMyTopicsResolve(),
              webq.getMyCollectionResolve()
            ]).then(function(results) {
                var latestMyTopics = results[0];

                if (latestMyTopics) {
                    myTopics = latestMyTopics;
                    onGoingStuffs = _.filter(myTopics, function(x) {
                        return x.goods_status === '在售';
                    });

                    offShelfStuffs = _.filter(myTopics, function(x) {
                        return x.goods_status === '下架';
                    });

                }

                favoritesStuffs = results[1];

                if (callback) callback();
            });
        } else if (myTopics) {
            onGoingStuffs = _.filter(myTopics, function(x) {
                return x.goods_status === '在售';
            });

            offShelfStuffs = _.filter(myTopics, function(x) {
                return x.goods_status === '下架';
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
                $scope.isFavoriteTab = false;
                break;
            case 'offShelfStuffs':
                _separateMyTopics(true, function() {
                    $scope.stuffs = offShelfStuffs;
                    _resetScopeData();
                });
                $scope.isFavoriteTab = false;
                break;
            case 'favoritesStuffs':
                _separateMyTopics(true, function() {
                    $scope.stuffs = favoritesStuffs;
                    _resetScopeData();
                });
                $scope.isFavoriteTab = true;
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
     * 取消收藏
     * tab: favoritesStuffs
     * @param  {[type]} topic [description]
     * @return {[type]}       [description]
     */
    $scope.editUnCollected = function(topic) {
        Topic.deCollectTopic(topic._id).$promise.then(function(response) {
            console.log(response);
            if (response.success) {
                console.log('success uncollected topic');
                _separateMyTopics(true, function() {
                    $scope.stuffs = favoritesStuffs;
                    _resetScopeData();
                });
            }
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
    console.log('Get stateParams: ' + JSON.stringify($stateParams));
    var accesstoken = $stateParams.accessToken;
    if (accesstoken) {
        store.setAccessToken($stateParams.accessToken);
    }
    if ($stateParams.redirectUrl) {
        window.location = decodeURIComponent($stateParams.redirectUrl);
    } else {
        $state.go('tab.index');
    }
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
