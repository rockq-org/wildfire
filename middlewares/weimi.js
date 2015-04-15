/**
 * Weimi SMS Service
 */

var logger = require('../common/loggerUtil').getLogger('weimi');
var request = require('superagent');

/**
 * send verify code for register account
 * @param  {array} mobiles recipients list
 * @return {promise}         [description]
 */
exports.sendVerifyCodeForRegisterAccount = function(mobiles) {
	
}