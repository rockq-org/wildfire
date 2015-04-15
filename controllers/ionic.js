/**
 * dispatcher of ionic app
 */
var common = require('../common'),
    logger = common.loggerUtil.getLogger("ionic"),
    requestUtil = common.requestUtil,
    u = require('util'),
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
                    jsApiList: ['scanQRCode']
                },
                appId: 'ggj',
                title: '呱呱叫',
                ngapp: 'iwildfire'
            }

            logger.debug('wxCredentials', JSON.stringify(params));

            // get the wxSig Object
            res.render('ionic/wechat', params);

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
