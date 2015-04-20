angular.module('iwildfire.controllers', [])

.controller('IndexCtrl', function($scope, Tabs) {
    $scope.sideMenus = Tabs;
})

.controller('PostCtrl', function ($scope, Tabs) {

    $scope.params = {};

    $scope.params.tag = '';

    $scope.changeTag = function (value) {
        $scope.params.tag = value;
    };

    $scope.uploadImage = function () {
        // setup weixin sdk
        // http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#JSSDK.E4.BD.BF.E7.94.A8.E6.AD.A5.E9.AA.A4
        if (window.ARRKING_WECHAT_SIG && window.ARRKING_WECHAT_SIG.appId) {
            wx.config(window.ARRKING_WECHAT_SIG);
            wx.error(function(err) {
                alert(err);
            });
            wx.ready(function() {
                alert(1);
                wx.chooseImage({
                    success: function(res) {
                        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    }
                });
            });
        }
    };

    $scope.tagList = Tabs;

    $scope.qualityList = [{
        name: '全新'
    }, {
        name: '很新'
    }, {
        name: '完好'
    }, {
        name: '适用'
    }, {
        name: '能用'
    }];
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

.controller('TopicsCtrl', function($scope, $rootScope, $stateParams, $ionicLoading, $ionicModal, $timeout, $state, $location, $log, Topics, Tabs) {
  $log.debug('topics ctrl', $stateParams);

  // before enter view event
  $scope.$on('$ionicView.beforeEnter', function() {
    // track view
    if (window.analytics) {
      window.analytics.trackView('topics view');
    }
  });

  $scope.currentTab = Topics.currentTab();

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
  $log.debug('page load, has next page ? ', $scope.hasNextPage);
  $scope.doRefresh = function() {
    Topics.currentTab($stateParams.tab);
    $log.debug('do refresh');
    Topics.refresh().$promise.then(function(response) {
        $log.debug('do refresh complete');
        $scope.topics = response.data;
        $scope.hasNextPage = true;
        $scope.loadError = false;
      }, $rootScope.requestErrorHandler({
        noBackdrop: true
      }, function() {
        $scope.loadError = true;
      })
    ).finally(function() {
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
        }, 100);
        $scope.topics = $scope.topics.concat(response.data);
      }, $rootScope.requestErrorHandler({
        noBackdrop: true
      }, function() {
        $scope.loadError = true;
      })
    ).finally(function() {
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

})
.controller('TopicCtrl', function(
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
  User
) {
  console.log('zzzzz');
  $log.debug('topic ctrl', $stateParams);
  var id = $stateParams.id;
  var topic = Topics.getById(id);
  $scope.topic = topic;

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
      })
    );
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
      }, function() {
      }).finally(function() {
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
      buttons: [
        {text: '回复'},
        {text: upLabel}
      ],
      titleText: replyContent,
      cancel: function() {
      },
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
  $scope.collectTopic = function () {
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
;
