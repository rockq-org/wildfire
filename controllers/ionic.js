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


// wechat only supprt 80 port and the HOST is register in wechat web console
// this is for security reason, but it also means, developer can not 
// retrieve signature during development. So, the comom.argv.host here
// is used in niobe.arrking.com. It only possible to debug signature after 
// niobe is publish into production or staging.
// var MAPP_URL_PREFIX = config.host === 'niobe.arrking.com' ? 'http://niobe.arrking.com/mapps' :
//     u.format('http://%s:%d/mapps', common.argv.host, common.argv.port);

var APP_URL;


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

if (minimatch(config.host, "*.arrking.com")) {
    // with arrking.com domain
    APP_URL = u.format('http://%s/public/ionic/www/wechat', config.host);
} else {
    // something like localhost or local IP
    APP_URL = u.format('http://%s:%d/public/ionic/www/wechat', config.host, config.port);
}

exports.getWechatApp = function(req, res, next) {
    /**
     * only attache wx signature header running on niobe.arrking.com
     * In the end, res is handle by res.redirect(mappUrl)
     * or res.render('mapps-wx') which contains the signature.
     * @param  {[type]}
     * @return {[type]}
     */

    wx.getWxJsapiTicketFromRedis()
        .then(function(jspApiTicket) {
            return wx.getSignatureByJspApiTicketAndUrl(jspApiTicket, APP_URL);
        }, function(err) {
            // can not get jspApiTicket
            logger.error(err);
            next();
        })
        .then(function(wxCredentials) {
            var params = {
                wxSig: {
                    debug: wxConfig.debug,
                    appId: wxConfig.appId,
                    timestamp: wxCredentials.timestamp,
                    nonceStr: wxCredentials.noncestr,
                    signature: wxCredentials.signature,
                    // 附录2-所有JS接口列表
                    // http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#.E6.8B.8D.E7.85.A7.E6.88.96.E4.BB.8E.E6.89.8B.E6.9C.BA.E7.9B.B8.E5.86.8C.E4.B8.AD.E9.80.89.E5.9B.BE.E6.8E.A5.E5.8F.A3
                    jsApiList: ['scanQRCode', 'chooseImage', 'getLocation', 'openLocation']
                },
                appId: 'ggj',
                title: '呱呱叫',
                ngapp: 'iwildfire'
            }

            logger.debug('wxCredentials', JSON.stringify(params));

            if (req.params.userId) {
                logger.debug('_resolveUserProfile', 'get user by id ' + req.params.userId);
                _resolveUserProfile(req.params.userId)
                    .then(function(user) {
                        params.user = user;
                        res.render('ionic/wechat', params);
                    })
                    .fail(function(err) {
                        logger.error(err);
                        res.render('ionic/wechat', params);
                    });
            } else {
                // get the wxSig Object
                res.render('ionic/wechat', params);
            }

            // res.render('mapps-wx.ejs', {
            //     wxSig: {
            //         debug: common.sys.wechat_gzh.debug,
            //         appId: common.sys.wechat_gzh.appId,
            //         timestamp: wxCredentials.timestamp,
            //         nonceStr: wxCredentials.noncestr,
            //         signature: wxCredentials.signature,
            //         jsApiList: ['scanQRCode']
            //     },
            //     appId: appId,
            //     title: mappw[appId].title,
            //     ngapp: mappw[appId].ngapp
            // });
        })
        .fail(function(err) {
            // wx.getSignatureByJspApiTicketAndUrl throw an error
            logger.error(err);
            next();
        })
        .done();
}
