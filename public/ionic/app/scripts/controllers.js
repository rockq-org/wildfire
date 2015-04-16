angular.module('iwildfire.controllers', [])

.controller('IndexCtrl', function($scope) {})

.controller('MapsCtrl', function($scope) {

})

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
    $scope.itemClass = function( item ){
        var itemClass = 'item-remove-animate item-avatar chat';
        if( item.userId == userId ) {
            itemClass = 'item-remove-animate item-avatar-right chat  chat-right';
        }
        return itemClass;
    }
    $scope.chats = Chats.all();
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
})

.controller('BindMobilePhoneCtrl', function($scope, $state) {
    $scope.bindPhoneNumber = function() {
        $state.go('tab.index');
    }
})

;
