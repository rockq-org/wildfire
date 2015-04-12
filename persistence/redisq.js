/*
 * Redis Qs and other Service
 */

var Q = require('q'),
    common = require('../common'),
    logger = common.loggerUtil.getLogger('redisq'),
    u = require('util'),
    redisClient = require('./redis');


var WX_ACCESS_TOKEN_KEY = 'WILDFIRE_WX_ACCESS_TOKEN';
var WX_JSPAPI_TICKET_KEY = 'WILDFIRE_WX_JSPAPI_TICKET';

exports.getWxAccessToken = function() {
    var defer = Q.defer();
    redisClient.get(WX_ACCESS_TOKEN_KEY, function(err, reply) {
        if (err) {
            defer.reject(err);
        } else if (reply) {
            defer.resolve(reply);
        } else {
            // reply is null, undefined
            defer.reject();
        }
    })
    return defer.promise;
}

exports.setWxAccessToken = function(v) {
    var defer = Q.defer();
    if (v.access_token && v.expires_in) {
        var duration = v.expires_in - 200;
        logger.debug('setWxAccessToken', u.format('%s expires in %d seconds.', v.access_token, duration));
        redisClient.set(WX_ACCESS_TOKEN_KEY, v.access_token, function(err, reply) {
            if (err) {
                defer.reject(err);
            } else {
                redisClient.expire(WX_ACCESS_TOKEN_KEY, duration, function(err2, reply2) {
                    if (err2) {
                        defer.reject(err2);
                    } else {
                        defer.resolve(v.access_token);
                    }
                });
            }
        });
    } else {
        defer.reject(new Error('Unexpected data format.'));
    }
    return defer.promise;
}

exports.getWxAccessTokenTTL = function() {
    var defer = Q.defer();
    redisClient.ttl(WX_ACCESS_TOKEN_KEY, function(err, ttl) {
        if (err) {
            defer.reject(err);
        } else if (ttl == -1) {
            defer.reject(new Error(u.format("%s does not exist.", WX_ACCESS_TOKEN_KEY)));
        } else {
            defer.resolve(ttl);
        }
    });

    return defer.promise;
}

exports.getWxJsapiTicket = function() {
    var defer = Q.defer();
    redisClient.get(WX_JSPAPI_TICKET_KEY, function(err, reply) {
        if (err) {
            defer.reject(err);
        } else if (reply) {
            defer.resolve(reply);
        } else {
            // reply is null, undefined
            defer.reject();
        }
    })
    return defer.promise;
}


exports.setWxJsapiTicket = function(v) {
    var defer = Q.defer();
    if (v.ticket && v.expires_in) {
        var duration = v.expires_in - 200;
        logger.debug('setWxJsapiTicket', u.format('%s expires in %d seconds.', v.ticket, duration));
        redisClient.set(WX_JSPAPI_TICKET_KEY, v.ticket, function(err, reply) {
            if (err) {
                defer.reject(err);
            } else {
                redisClient.expire(WX_JSPAPI_TICKET_KEY, duration, function(err2, reply2) {
                    if (err2) {
                        defer.reject(err2);
                    } else {
                        defer.resolve(v.ticket);
                    }
                });
            }
        });
    } else {
        defer.reject(new Error('Unexpected data format.'));
    }
    return defer.promise;
}

exports.getWxJsapiTicketTTL = function() {
    var defer = Q.defer();
    redisClient.ttl(WX_JSPAPI_TICKET_KEY, function(err, ttl) {
        if (err) {
            defer.reject(err);
        } else if (ttl == -1) {
            defer.reject(new Error(u.format("%s does not exist.", WX_JSPAPI_TICKET_KEY)));
        } else {
            defer.resolve(ttl);
        }
    });

    return defer.promise;
}
