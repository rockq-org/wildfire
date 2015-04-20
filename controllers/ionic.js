/**
 * dispatcher of ionic app
 */
var common = require('../common'),
    logger = common.loggerUtil.getLogger("ionic"),
    requestUtil = common.requestUtil,
    u = require('util'),
    User = require('../proxy').User,
    Q = require('q'),
    _ = require('lodash'),
    minimatch = require("minimatch"),
    wx = require('../middlewares/connect-wechat'),
    config = require('../config'),
    wxConfig = config.wechat_gzh;


function _resolveUserProfile(userId) {
    var deferred = Q.defer();
    User.getUserById(userId, function(err, doc) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(doc);
        }
    });
    return deferred.promise;
}


exports.getWechatApp = function(req, res, next) {
    logger.debug('getWechatApp', 'userId:' + req.query.userId);
    var params = {};
    if (req.query.userId) {
        logger.debug('_resolveUserProfile', 'get user by id ' + req.query.userId);
        _resolveUserProfile(req.query.userId)
            .then(function(user) {
                params.user = user;
                res.render('ionic/wechat', params);
            })
            .fail(function(err) {
                logger.error(err);
                res.render('ionic/wechat', params);
            });
    } else {
        res.render('ionic/wechat', params);
    }
}
