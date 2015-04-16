var _ = require('lodash');
var eventproxy = require('eventproxy');
var UserProxy = require('../../proxy').User;
var TopicProxy = require('../../proxy').Topic;
var ReplyProxy = require('../../proxy').Reply;
var TopicCollect = require('../../proxy').TopicCollect;
var weimi = require('../../middlewares/weimi');
var redisq = require('../../persistence/redisq');
var logger = require('../../common').loggerUtil.getLogger('api/v1/user');
var requestUtil = require('../../common').requestUtil;

var show = function(req, res, next) {
    var loginname = req.params.loginname;

    var ep = new eventproxy();
    ep.fail(next);

    UserProxy.getUserByLoginName(loginname, ep.done(function(user) {
        if (!user) {
            return res.send({
                error_msg: 'user `' + loginname + '` is not exists'
            });
        }
        var query = {
            author_id: user._id
        };
        var opt = {
            limit: 5,
            sort: '-create_at'
        };
        TopicProxy.getTopicsByQuery(query, opt, ep.done('recent_topics'));

        ReplyProxy.getRepliesByAuthorId(user._id, {
                limit: 20,
                sort: '-create_at'
            },
            ep.done(function(replies) {
                var topic_ids = [];
                for (var i = 0; i < replies.length; i++) {
                    if (topic_ids.indexOf(replies[i].topic_id.toString()) < 0) {
                        topic_ids.push(replies[i].topic_id.toString());
                    }
                }
                var query = {
                    _id: {
                        '$in': topic_ids
                    }
                };
                var opt = {
                    limit: 5,
                    sort: '-create_at'
                };
                TopicProxy.getTopicsByQuery(query, opt, ep.done('recent_replies'));
            }));

        TopicCollect.getTopicCollectsByUserId(user._id,
            ep.done(function(collections) {
                var topic_ids = [];
                for (var i = 0; i < collections.length; i++) {
                    if (topic_ids.indexOf(collections[i].topic_id.toString()) < 0) {
                        topic_ids.push(collections[i].topic_id.toString());
                    }
                }
                var query = {
                    _id: {
                        '$in': topic_ids
                    }
                };
                var opt = {
                    sort: '-create_at'
                };
                TopicProxy.getTopicsByQuery(query, opt, ep.done('collect_topics'));
            }));
        ep.all('recent_topics', 'recent_replies', 'collect_topics',
            function(recent_topics, recent_replies, collect_topics) {

                user = _.pick(user, ['loginname', 'avatar_url', 'githubUsername',
                    'create_at', 'score'
                ]);

                user.recent_topics = recent_topics.map(function(topic) {
                    topic.author = _.pick(topic.author, ['loginname', 'avatar_url']);
                    topic = _.pick(topic, ['id', 'author', 'title', 'last_reply_at']);
                    return topic;
                });
                user.recent_replies = recent_replies.map(function(topic) {
                    topic.author = _.pick(topic.author, ['loginname', 'avatar_url']);
                    topic = _.pick(topic, ['id', 'author', 'title', 'last_reply_at']);
                    return topic;
                });
                user.collect_topics = collect_topics.map(function(topic) {
                    topic.author = _.pick(topic.author, ['loginname', 'avatar_url']);
                    topic = _.pick(topic, ['id', 'author', 'title', 'last_reply_at']);
                    return topic;
                });

                res.send({
                    data: user
                });
            });
    }));
};

exports.bindPhoneNumber = function(req, res, next) {
    logger.debug('bindPhoneNumber', 'user ' + JSON.stringify(req.user));
    if (typeof req.body === 'object' && req.body.phoneNumber) {
        weimi.sendVerifyCodeToRegisterAccount(req.user._id, req.body.phoneNumber)
            .then(function(result) {
                requestUtil.okJsonResponse({
                    rc: 0,
                    msg: 'Success.'
                }, res);
            }, function(err) {
                requestUtil.okJsonResponse({
                    rc: 1,
                    msg: err
                }, res);
            });
    } else {
        requestUtil.okJsonResponse({
            rc: 2,
            msg: 'Invalid parameter.'
        }, res);
    }
}

exports.checkPhoneVerifyCode = function(req, res, next) {
    logger.debug('checkPhoneVerifyCode', JSON.stringify(req.body));
    if (typeof req.body === 'object' && req.body.code && req.body.code.length === 4 && req.body.phoneNumber) {
        redisq.checkPhoneVerifyCode(req.user._id, req.body.phoneNumber, req.body.code)
            .then(function(result) {
                if (result.rc === 1) {
                    return UserProxy.updateUserPhoneNumber(req.user._id, req.body.phoneNumber);
                } else {
                    throw result;
                }
            })
            .then(function() {
                requestUtil.okJsonResponse({
                    rc: 0,
                    msg: 'Phone number is verified.'
                }, res);
            })
            .fail(function(err) {
                requestUtil.okJsonResponse({
                    rc: 2,
                    msg: err
                }, res);
            });
    } else {
        requestUtil.okJsonResponse({
            rc: 1,
            msg: 'Invalid parameter.'
        }, res);
    }
}

exports.show = show;
