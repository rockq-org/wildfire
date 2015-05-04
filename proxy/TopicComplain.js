var TopicComplain = require('../models').TopicComplain;

exports.newAndSave = function (args, callback) {
  var topicComplain = new TopicComplain();
  topicComplain.user_id = args.user_id;
  topicComplain.topic_id = args.topic_id;
  topicComplain.description = args.description;
  topicComplain.is_processed = 'false';
  topicComplain.save(callback);
};
