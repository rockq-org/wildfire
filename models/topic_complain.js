var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TopicComplainSchema = new Schema({
  user_id: { type: ObjectId },
  topic_id: { type: ObjectId },
  description: {type: String}, // 举报理由
  is_processed: {type: String}, // 后台运营人员是否已经处理
  create_at: { type: Date, default: Date.now }
});

mongoose.model('TopicComplain', TopicComplainSchema);
