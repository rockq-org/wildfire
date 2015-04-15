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

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
})

.controller('BindMobilePhoneCtrl', function($scope, $state, $ionicPopup,
    $ionicLoading, $timeout) {
    var phonenoPattern = /^\(?([0-9]{11})\)?$/;
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

    function _show() {
        $ionicLoading.show({
            template: '发送验证码 ...'
        });
    };

    function _hide() {
        $ionicLoading.hide();
    };


    $scope.sendVerifyCode = function() {
        // verify the input nubmer is a phone number
        // alert('sendVerifyCode' + JSON.stringify($scope.data));
        if ($scope.data.phoneNumber &&
            isPhonenumber($scope.data.phoneNumber)) {
            // user has input a phone number
            // post request to send the api
        	_show();
        	$timeout(function(){
        		_hide();
        	}, 3000);
        } else {
            // validate failed.
            $scope.data.phoneNumber = null;
            angular.element(document.getElementById('phoneNumber')).attr('placeholder', '输入正确的手机号码');
        }
    }

    $scope.bindPhoneNumber = function() {
        alert(JSON.stringify($scope.data));
        // $state.go('tab.index');
    }
})

;
