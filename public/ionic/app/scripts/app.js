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

// global config for uniform ui for different platform
.config(function($ionicConfigProvider) {
    $ionicConfigProvider.views.transition('ios');
    $ionicConfigProvider.tabs.style('standard');
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center');
})

.config(function($stateProvider, $urlRouterProvider) {

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
                controller: 'IndexCtrl',
                // https://github.com/angular-ui/ui-router/wiki#resolve
                resolve: {
                    wxWrapper: function(webq) {
                        return webq.getWxWrapper();
                    }
                }
            }
        }
    })

    .state('item', {
        url: '/item/:itemId',
        templateUrl: 'templates/item.html',
        controller: 'ItemCtrl'
    })

    .state('tab.post', {
        cache: false,
        url: '/post',
        views: {
            'tab-post': {
                templateUrl: 'templates/tab-post.html',
                controller: 'PostCtrl',
                // https://github.com/angular-ui/ui-router/wiki#resolve
                resolve: {
                    wxWrapper: function(webq) {
                        return webq.getWxWrapper();
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
                controller: 'MapsCtrl',
                resolve: {
                    wxWrapper: function(webq) {
                        return webq.getWxWrapper();
                    },
                    locationDetail: function($q, wxWrapper){
                         var deferred = $q.defer();
                         var locationDetail = {};
                         wxWrapper.getLocation({
                            success: function(res) {
                                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                                var speed = res.speed; // 速度，以米/每秒计
                                var accuracy = res.accuracy; // 位置精度
                                console.log('lyman 138', JSON.stringify(res));
                                var geocoder;
                                var center = new qq.maps.LatLng(latitude, longitude);
                                var geocoder = new qq.maps.Geocoder();
                                geocoder.getAddress(center);
                                geocoder.setComplete(function(result) {
                                    var c = result.detail.addressComponents;
                                    var address = c.province + c.city + c.district + c.street + c.streetNumber + c.town + c.village;
                                    locationDetail.api_address = address;
                                    locationDetail.user_edit_address = address;
                                    locationDetail.latitude = latitude;
                                    locationDetail.longitude = longitude;
                                    console.log('lyman 151', JSON.stringify(locationDetail));
                                });
                            }
                        });
                        return deferred.promise;
                     }
                }
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
                    myProfile: function(webq) {
                        return webq.getMyProfileResolve();
                    },
                    myTopics: function(webq) {
                        return webq.getMyTopicsResolve();
                    }
                }
            }
        }
    })

    .state('settings', {
        cache: false,
        url: '/settings',
        templateUrl: 'templates/settings/index.html',
        controller: 'SettingsCtrl'
    })

    .state('service-agreement', {
        cache: false,
        url: '/service-agreement',
        templateUrl: 'templates/settings/service-agreement.html',
        controller: 'SettingsCtrl'
    })

    .state('feedback', {
        cache: false,
        url: '/feedback',
        templateUrl: 'templates/settings/feedback.html',
        controller: 'SettingsCtrl'
    })

    .state('about', {
        cache: false,
        url: '/about',
        templateUrl: 'templates/settings/about.html',
        controller: 'SettingsCtrl'
    })

    .state('help', {
        cache: false,
        url: '/help',
        templateUrl: 'templates/settings/help.html',
        controller: 'SettingsCtrl'
    })

    .state('bind-mobile-phone', {
        cache: false,
        url: '/bind-mobile-phone/:accessToken',
        templateUrl: 'templates/bind-mobile-phone.html',
        controller: 'BindMobilePhoneCtrl'
    })

    .state('bind-access-token', {
        cache: false,
        url: '/bind-access-token/:accessToken',
        templateUrl: 'templates/bind-access-token.html',
        controller: 'BindAccessTokenCtrl'
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/index/');
});
