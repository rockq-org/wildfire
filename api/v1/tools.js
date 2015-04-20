var eventproxy = require('eventproxy');
var logger = require('../../common/loggerUtil').getLogger('/api/v1/tools');

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

exports.accesstoken = accesstoken;
