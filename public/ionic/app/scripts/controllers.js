angular.module('iwildfire.controllers', [])

.controller('IndexCtrl', function($scope) {

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
.controller('PostCtrl', function($scope, $log, webq, wechat_signature) {

    $scope.params = {
        // 标题5到10个字
        title: null,
        content: null,
        tab: null,
        quality: null,
        goods_pics: ['link1', 'link2'],
        goods_pre_price: null,
        goods_now_price: null,
        goods_is_bargain: true,
        // dummy data
        goods_exchange_location: {
            txt: '北京市海淀区西二旗中路6号1区4号楼', // user input text
            lat: '40.056961', // latitude
            lng: '116.318857' // longitude
        },
        goods_status: '在售'
    };

    $scope.tagList = [{
        name: '教材书籍',
        tab: 'books'
    }, {
        name: '数码电器',
        tab: '数码电器'
    }, {
        name: '代步工具',
        tab: 'transports'
    }, {
        name: '衣服饰品',
        tab: 'clothes'
    }, {
        name: '生活用品',
        tab: 'supplies'
    }, {
        name: '运动健身',
        tab: 'healthcare'
    }, {
        name: '其它',
        tab: 'others'
    }];

    $scope.qualityList = ['全新', '很新', '完好', '适用', '能用'];

    $scope.changeTag = function(value) {
        $scope.params.tab = value;
        $log.debug('params: {0}'.f(JSON.stringify($scope.params)));
    };

    $scope.changeQuality = function(value) {
        $scope.params.quality = value;
        $log.debug('params: {0}'.f(JSON.stringify($scope.params)));
    }

    $scope.uploadImage = function() {
        // setup weixin sdk
        // http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#JSSDK.E4.BD.BF.E7.94.A8.E6.AD.A5.E9.AA.A4

        // if APP URL is not belong to arrking.com , 
        // wechat_signature is null.
        if (wechat_signature) {
            wx.config(wechat_signature);
            wx.error(function(err) {
                alert(err);
            });
            wx.ready(function() {
                wx.chooseImage({
                    success: function(res) {
                        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    }
                });
            });
        } else {
            $log.debug('app url: {0}. wechat_signature is not available.'.f(window.location.href.split('#')[0]));
        }
    };

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
                        // #TODO navigate to detail page.
                        alert('创建成功！');
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

})

.controller('NavCtrl', function($scope, $ionicSideMenuDelegate) {
    $scope.category = '全部';
    $scope.showMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.showRightMenu = function() {
        $ionicSideMenuDelegate.toggleRight();
    };
})

.controller('MapsCtrl', function($scope) {})

.controller('InboxCtrl', function($scope, Chats) {
    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    }
})

.controller('InboxDetailCtrl', function($scope, $stateParams, Chats) {
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
    $scope.chats = Chats.all();
})

.controller('AccountCtrl', function($scope, store, cfg) {
    var userProfile = store.getUserProfile() || {};
    if (!userProfile && !cfg.debug) {
        // change to wechat uaa page
        window.location.href = '{0}/auth/wechat/embedded'.f(cfg.server);
    } else {
        $scope.data = {
            name: userProfile.name || 'foo',
            avatar: userProfile.avatar || 'images/dummy-avatar.jpg',
            phone: userProfile.phone_number || 'bar',
            title: '我的呱呱',
            badge: {
                onGoingStuffs: 1,
                offShelfStuffs: 2,
                favoritesStuffs: 3
            }
        };
        $scope.active_content = 'orders';
        $scope.setActiveContent = function(active_content) {
            $scope.active_content = active_content;
        }

        //     $scope.stuffs = [{
        //         name: 'foo'
        //     }, {
        //         name: 'bar'
        //     }, {
        //         name: 'foo'
        //     }, {
        //         name: 'bar'
        //     }, {
        //         name: 'foo'
        //     }, {
        //         name: 'bar'
        //     }, {
        //         name: 'foo'
        //     }, {
        //         name: 'bar'
        //     }, {
        //         name: 'foo'
        //     }, {
        //         name: 'bar'
        //     }, {
        //         name: 'foo'
        //     }, {
        //         name: 'bar'
        //     }, {
        //         name: 'foo'
        //     }, {
        //         name: 'bar'
        //     }, {
        //         name: 'foo'
        //     }, {
        //         name: 'bar'
        //     }, {
        //         name: 'foo'
        //     }, {
        //         name: 'bar'
        //     }, {
        //         name: 'foo'
        //     }, {
        //         name: 'bar'
        //     }]

    }

    $scope.onTabSelected = function(category) {
        switch (category) {
            case 'onGoingStuffs':
                $scope.stuffs = [{
                    name: '我是正在售出1'
                }, {
                    name: '我是正在售出2'
                }];
                break;
            case 'offShelfStuffs':
                $scope.stuffs = [{
                    name: '我是正在下架1'
                }, {
                    name: '我是正在下架2'
                }];
                break;
            case 'favoritesStuffs':
                $scope.stuffs = [{
                    name: '我是正在收藏1'
                }, {
                    name: '我是正在收藏2'
                }];
                break;
            default:
                break;
        }
    }


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

;
