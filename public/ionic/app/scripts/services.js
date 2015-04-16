angular.module('iwildfire.services', [])

.factory('Chats', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
        id: 0,
        userId: '00001',
        name: 'tb234243',
        lastText: '用户直接跟你对话的，这里显示你们最后一条的对话内容（可能是你的也可能是他的）点击后最顶部是宝贝的链接',
        face: 'templates/tab-inbox-imgs/avatar.jpeg'
    }, {
        id: 1,
        userId: '00002',
        name: '宝贝留言',
        lastText: 'tb234243: 有点贵哦（这个是用户名+宝贝留言内容，点击到达宝贝页面的留言位置）',
        face: 'templates/tab-inbox-imgs/1.jpg'
    }, {
        id: 1,
        userId: '00002',
        name: 'name here',
        lastText: 'less text',
        face: 'templates/tab-inbox-imgs/1.jpg'
    }];

    return {
        all: function() {
            return chats;
        },
        remove: function(chat) {
            chats.splice(chats.indexOf(chat), 1);
        },
        get: function(chatId) {
            for (var i = 0; i < chats.length; i++) {
                if (chats[i].id === parseInt(chatId)) {
                    return chats[i];
                }
            }
            return null;
        }
    };
})

.service('webq', function($http, $q, $log, cfg) {

    this.sendVerifyCode = function(phoneNumber) {
        var deferred = $q.defer();
        $http.post('{0}/api/v1/user/bind_phone_number'.f(cfg.server), {
                phoneNumber: phoneNumber
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .success(function(data) {
                if (typeof data === 'object' && data.rc === 0) {
                    deferred.resolve(data);
                } else {
                    deferred.reject(data);
                }
            })
            .error(function(err) {
                deferred.reject(err);
            });

        return deferred.promise;
    }


})

;
