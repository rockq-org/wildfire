var eventproxy = require('eventproxy');
var logger = require('../../common/loggerUtil').getLogger('/api/v1/tools');
var HashState = require('../../proxy').HashState;

var accesstoken = function(req, res, next) {
    var ep = new eventproxy();
    ep.fail(next);

    res.send({
        success: true,
        loginname: req.user.loginname,
        avatar_url: req.user.avatar_url,
        id: req.user.id,
        profile: req.user
    });
};

exports.getAccessToken = function(req, res, next) {
    if (req.session.user) {
        res.send({
            rc: 0,
            loginname: req.session.user.loginname,
            avatar_url: req.session.user.avatar_url,
            id: req.session.user.id,
            accesstoken: req.session.user.accessToken
        });
    } else {
        res.send({
            rc: 1,
            msg: 'session does not exist, maybe cookie is expired.'
        });
    }
}

/**
 * get state value by md5
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.getHashStateByMd5 = function(req, res, next) {
    if (req.body && req.body.md5 && req.body.md5 !== '') {
        HashState.getHashStateByMD5(req.body.md5)
            .then(function(doc) {
                if (doc && doc.value) {
                    res.send({
                        rc: 0,
                        msg: doc.value
                    });

                } else {
                    res.send({
                        rc: 1,
                        msg: 'state does not exist.'
                    });
                }
            }, function(err) {
                res.send({
                    rc: 2,
                    msg: err
                });
            });
    } else {
        res.send({
            rc: 3,
            msg: 'required parameter in body.'
        });
    }
}

exports.accesstoken = accesstoken;
