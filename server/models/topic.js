/**
 * Topic
 * http://mongoosejs.com/docs/guide.html
 * @type {[type]}
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var config = require('../config');
var _ = require('lodash');

/**
 * Schema Type
 * http://mongoosejs.com/docs/api.html#schematype_SchemaType
 * @type {Schema}
 */
var TopicSchema = new Schema({
  /**
   * 标题
   * 与nodeclub保持一致，对二手物品的简短描述，20字以内
   * @type {String}
   */
  title: { type: String },
  /**
   * 文字描述
   * 与nodeclub保持一致，对交易物品的详细描述
   * @type {String}
   */
  content: { type: String },
  author_id: { type: ObjectId },
  top: { type: Boolean, default: false }, // 置顶帖
  good: {type: Boolean, default: false}, // 精华帖
  lock: {type: Boolean, default: false}, // 被锁定主题
  reply_count: { type: Number, default: 0 },
  /**
   * 帖子浏览的次数
   * @type {Number}
   */
  visit_count: { type: Number, default: 0 },
  /**
   * 帖子的收藏数
   * @type {Number}
   */
  collect_count: { type: Number, default: 0 },
  /**
   * 与nodeclub保持一致，创建这个二手物品的时间
   * @type {Date}
   */
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  last_reply: { type: ObjectId },
  last_reply_at: { type: Date, default: Date.now },
  content_is_html: { type: Boolean },
  /**
   * 类别
   * @type ［教材书籍|代步工具|数码电器|生活用品|运动健身|衣帽饰物|其它］
   *    ['books', '教材书籍'],
        ['transports', '代步工具'],
        ['electronics', '数码电器'],
        ['supplies', '生活用品'],
        ['healthcare', '运动健身'],
        ['clothes', '衣帽饰物'],
        ['others', '其它']
   */
  tab: {type: String},
  deleted: {type: Boolean, default: false},
  /**
   * goods pictures
   * upload by https://github.com/arrking/wildfire/issues/54
   */
  goods_pics: {type: Schema.Types.Mixed, required: true},
  /**
   * 一手或物主购买时的价格, 人民币，正整型
   * @type {Number}
   */
  goods_pre_price: {type: Number, required: false},
  /**
   * 物主出手的价格, 人民币，正整型
   * @type {Number}
   */
  goods_now_price: {type: Number, required: true},
  /**
   * 是否支持侃价, 侃价是一种特殊的评论，只是评论时表单不一样，展示不一样
   * @type {Boolean}
   */
  goods_is_bargain: {type: Boolean, required: true, default: true},
  /**
   *
   * @type [全新，很新，完好，适用，能用]
   */
  goods_quality_degree: {type: String, required: true, default: '完好'},
  /**
   * 选择和买主碰头的地点
   * https://github.com/arrking/wildfire/issues/31
   * @type {Object}
   */
  goods_exchange_location: {type: Schema.Types.Mixed, required: true},
  goods_exchange_geom: {type: Schema.Types.Mixed, required: true},
  /**
   * 交易物品状态
   * @type [被举报，在售，下架，售出]
   */
  goods_status: {type: String, required: true}
});

TopicSchema.index({create_at: -1});
TopicSchema.index({top: -1, last_reply_at: -1});
TopicSchema.index({last_reply_at: -1});
TopicSchema.index({author_id: 1, create_at: -1});
TopicSchema.index({goods_exchange_geom: '2dsphere'});

TopicSchema.virtual('tabName').get(function () {
  var tab = this.tab;
  var pair = _.find(config.tabs, function (_pair) {
    return _pair[0] === tab;
  });
  if (pair) {
    return pair[1];
  } else {
    return '';
  }
});

mongoose.model('Topic', TopicSchema);
