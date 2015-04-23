// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('iwildfire', ['ionic', 'iwildfire.controllers', 'iwildfire.services', 'iwildfire.directives', 'iwildfire.filters', 'config', 'angularMoment'])

.run(function($ionicPlatform, $rootScope, $log, store, webq, $ionicLoading, amMoment) {

    amMoment.changeLocale('zh-cn');

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }

        // attempt to get user profile data with cookie
        webq.getAccessToken()
            .then(function(data) {
                // accessToken is retrieved.
                store.setAccessToken(data.accesstoken);
                return webq.getUserProfile();
            }, function(err) {
                // handle err
                $log.error('getAccessToken throws an error.');
                $log.error(err);
            })
            .then(function(data2) {
                store.setUserProfile(data2);
            }, function(err2) {
                // body...
                $log.error('getUserProfile throws an error.');
                $log.error(err2);
            });
    });

    // error handler
    var errorMsg = {
        0: '网络出错啦，请再试一下',
        'wrong accessToken': '授权失败'
    };
    $rootScope.requestErrorHandler = function(options, callback) {
        return function(response) {
            var error;
            if (response.data && response.data.error_msg) {
                error = errorMsg[response.data.error_msg];
            } else {
                error = errorMsg[response.status] || 'Error: ' + response.status + ' ' + response.statusText;
            }
            var o = options || {};
            angular.extend(o, {
                template: error,
                duration: 1000
            });
            $ionicLoading.show(o);
            return callback && callback();
        };
    };
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    /**
     * by default, the tabs are put into top for wechat android.
     */
    $ionicConfigProvider.tabs.position('bottom');

    /**
     * more about ui-router
     * http://angular-ui.github.io/ui-router/site/
     */


    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.index', {
        url: '/index/:tab',
        views: {
            'tab-index': {
                templateUrl: 'templates/tab-index.html',
                controller: 'IndexCtrl'
            }
        }
    })

    .state('tab.topic', {
        url: '/topic/:id',
        views: {
            'tab-index': {
                templateUrl: 'templates/topic.html',
                controller: 'TopicCtrl'
            }
        }
    })

    .state('tab.post', {
        url: '/post',
        views: {
            'tab-post': {
                templateUrl: 'templates/tab-post.html',
                controller: 'PostCtrl',
                // https://github.com/angular-ui/ui-router/wiki#resolve
                resolve: {
                    wechat_signature: function(webq) {
                        // check the accesstoken
                        return webq.getWechatSignature();
                    }
                }
            }
        }
    })

    .state('tab.maps', {
        url: '/maps',
        views: {
            'tab-maps': {
                templateUrl: 'templates/tab-maps.html',
                controller: 'MapsCtrl'
            }
        }
    })

    .state('tab.inbox', {
        url: '/inbox',
        views: {
            'tab-inbox': {
                templateUrl: 'templates/tab-inbox.html',
                controller: 'InboxCtrl'
            }
        }
    })

    .state('tab.inbox-detail', {
        url: '/inbox/:chatId',
        views: {
            'tab-inbox': {
                templateUrl: 'templates/inbox-detail.html',
                controller: 'InboxDetailCtrl'
            }
        }
    })

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl',
                resolve: {
                    myTopics: function(webq) {
                        return webq.getMyTopicsResolve();
                    }
                }
            }
        }
    })

    .state('bind-mobile-phone', {
        url: '/bind-mobile-phone/:accessToken',
        templateUrl: 'templates/bind-mobile-phone.html',
        controller: 'BindMobilePhoneCtrl'
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/index/');
});
