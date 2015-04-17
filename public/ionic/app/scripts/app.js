// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('iwildfire', ['ionic', 'iwildfire.controllers', 'iwildfire.services', 'iwildfire.directive', 'config'])

.run(function($ionicPlatform, store) {
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

        if (window.ARRKING_WECHAT_USER) {
            store.setUserProfile(window.ARRKING_WECHAT_USER);
        }
        // setup weixin sdk
        // http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#JSSDK.E4.BD.BF.E7.94.A8.E6.AD.A5.E9.AA.A4
        // if (window.ARRKING_WECHAT_SIG && window.ARRKING_WECHAT_SIG.appId) {
        //     wx.config(window.ARRKING_WECHAT_SIG);
        //     wx.error(function(err) {
        //         alert(err);
        //     });
        //     wx.ready(function() {
        //         /**
        //          * check api permissions
        //          * @param  {[type]}
        //          * @return {[type]}
        //          */
        //         // wx.scanQRCode({
        //         //     desc: 'ScanQRCode API',
        //         //     needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        //         //     scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        //         //     success: function(res) {
        //         //         var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
        //         //         alert(result);
        //         //     }
        //         // });
        //         wx.chooseImage({
        //             success: function(res) {
        //                 var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        //             }
        //         });
        //     });
        // }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

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
        url: '/index',
        views: {
            'tab-index': {
                templateUrl: 'templates/tab-index.html',
                controller: 'IndexCtrl'
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
                controller: 'AccountCtrl'
            }
        }
    })

    .state('bind-mobile-phone', {
        url: '/bind-mobile-phone/:accessToken',
        templateUrl: 'templates/bind-mobile-phone.html',
        controller: 'BindMobilePhoneCtrl'
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/index');
});
