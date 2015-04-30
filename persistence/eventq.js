/**
 * subsribe EMPEvent and process triggers
 */

var Database = require('./database');
var logger = require('../common/loggerUtil').getLogger('eventq');
var appInit = require('../appinit.js');
var minimatch = require("minimatch");
var config = require('../config');

appInit.add();

/**
 * handle arrival events
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
function _handleOnBehalf(event) {
    logger.debug('_handleOnBehalf', event);
    // check event pattern and publish out.
    if (minimatch(event.event, "collection:messages:*")) {
        logger.debug('_handleOnBehalf', 'process collection:messages ...');
        logger.debug('_handleOnBehalf', JSON.stringify(event));
    }
}

Database.initPromise.onFulfill(function() {
    try {

        // listening all patterns
        Database.empEvent.on('*', function(event) {
            // logger.debug('on', event);
            setImmediate(_handleOnBehalf, event);
        });

        // eventq is started
        logger.info('eventq service is started.');
        appInit.resolve();
    } catch (err) {
        logger.error(err);
        appInit.reject(err);
    }

});
