var mongoose = require('mongoose');
var config = require('../config');

// models
require('./user');
require('./topic');
require('./reply');
require('./topic_collect');
require('./message');
require('./fileStorage');

exports.User = mongoose.model('User');
exports.Topic = mongoose.model('Topic');
exports.Reply = mongoose.model('Reply');
exports.TopicCollect = mongoose.model('TopicCollect');
exports.Message = mongoose.model('Message');

// use GridFS to manage files
exports.FileStorage = mongoose.model('FileStorage');
