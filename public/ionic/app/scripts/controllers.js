angular.module('iwildfire.controllers', [])

.controller('IndexCtrl', function($scope) {})

.controller('MapsCtrl', function($scope) {})

.controller('InboxCtrl', function($scope, Chats) {
    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    }
})

.controller('InboxDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
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
