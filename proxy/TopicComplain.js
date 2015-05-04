var TopicComplain = require('../models').TopicComplain;

exports.newAndSave = function (args, callback) {
  var topicComplain = new TopicComplain();
  topicComplain.userId = args.user_id;
  topicComplain.topicId = args.topic_id;
  topicComplain.description = args.description;
  // topicComplain.isProcessed = false;
  topicComplain.save(callback);
};
