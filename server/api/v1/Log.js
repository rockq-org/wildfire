var models = require('../../models');
var LogModel = models.Log;
var config = require('../../config');
var _ = require('lodash');
var validator = require('validator');

exports.save = function(req, res, next) {
    var type = validator.trim(req.body.type);
    var content = validator.trim(req.body.content);

    var log = new LogModel();
    log.type = type;
    log.content = content;

    log.save(function(data){
        res.send({});
    });
};