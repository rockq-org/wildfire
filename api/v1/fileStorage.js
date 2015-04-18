/**
 * File Management for Rest API
 */

var Q = require('q'),
    logger = require('../../common/loggerUtil').getLogger('fileStorage'),
    fileStorage = require('../../proxy').FileStorage,
    requestUtils = require('../../common/requestUtils'),
    fs = require('fs'),
    request = require('request'),
    httpContentTypeDef = require('../../common/http_content_type_definition'),
    shortid = require('shortid'),
    util = require('util'),
    utf8 = require('utf8');


function _downloadImageByWebURl(url) {
    var deferred = Q.defer();
    request.head(url, function(err, res, body) {
        var fileType = httpContentTypeDef.getExtByContentType(res.headers['content-type']);
        if (fileType) {
            var fileName = util.format('%s.%s', shortid.generate(), fileType);
            var filePath = util.format('public/upload/%s', fileName);
            request(url).pipe(fs.createWriteStream(filePath)).on('finish', function() {
                deferred.resolve({
                    url: url,
                    path: filePath,
                    name: fileName,
                    type: fileType
                });
            });
        } else {
            deferred.reject(new Error('Can not resolve file type with content-type:' + res.headers['content-type']));
        }
    });
    return deferred.promise;
}

function _saveFileByWebUrlInAnonymous(url) {
    var deferred = Q.defer();
    _downloadImageByWebURl(url)
        .then(function(result) {
            logger.debug('_saveFileByWebUrlInAnonymous', JSON.stringify(result));
            deferred.resolve(result);
        })
        .fail(function(err) {
            logger.error('_saveFileByWebUrlInAnonymous', err);
            deferred.reject(err);
        });
    return deferred.promise;
}

function _saveFileInGridFS(file, dir, task, user) {
    var deferred = Q.defer();
    fileStorage.writeFile(file, dir, task, user, function(err, doc) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(doc);
        }
    });
    return deferred.promise;
}

function _resolveRootDirObjectId() {
    var deferred = Q.defer();
    fileStorage.getRootDir(function(err, doc) {
        if (err) {
            console.error(err);
            deferred.reject(err);
        } else {
            deferred.resolve(doc._id);
        }
    });
    return deferred.promise;
}

exports.uploadWebUrlImage = function(req, res, next) {
        if (req.body.url) {
            // check body
            _saveFileByWebUrlInAnonymous(req.body.url)
                .then(function(result) {
                    // resolve dir
                    return _resolveRootDirObjectId()
                        .then(function(_id) {
                            result.dir = _id;
                            return result;
                        });
                })
                .then(function(result1) {
                    // save into Grid FS
                    var file = {
                        name: result1.name,
                        type: result1.type,
                        path: result1.path
                    };
                    logger.debug('_saveFileInGridFS', JSON.stringify(file));
                    var dir = result1.dir;
                    var user = req.user._id;

                    return _saveFileInGridFS(file, dir, /* task */ null, user);
                })
                .then(function(result2) {
                    requestUtils.okJsonResponse({
                        rc: 0,
                        path: '/api/v1/file/image-anonymous/' + result2._id,
                        message: util.format('%s are saved.', req.body.url),
                        result: result2
                    }, res, 200);
                })
                .fail(function(err) {
                    requestUtils.okJsonResponse({
                        rc: 2,
                        message: util.format('%s can not be saved.', req.body.url),
                        error: err
                    }, res, 200);
                });
        } else {
            requestUtils.okJsonResponse({
                rc: 1,
                message: 'invalid parameters'
            }, res, 200);
        }
    }
    /**
     * Display Anonymous Image
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
exports.displayAnonymousImage = function(req, res, next) {
    if (req.params.id) {
        fileStorage.readFileById(req.params.id, function(err, fileName, readStream) {
            if (err) {
                return requestUtils.okJsonResponse({
                    rc: 2,
                    message: 'can not get file by file id.',
                    error: err
                }, res, 200);
            } else {
                // get file
                // res.setHeader('content-disposition', 'attachement;filename=' + utf8.encode(fileName));
                var fileNameArray = fileName.split('.');
                var contentType = httpContentTypeDef.getContentType(fileNameArray[fileNameArray.length - 1]);
                res.setHeader('Content-type', contentType);
                readStream.pipe(res).on('finish', function() {
                    logger.debug('displayAnonymousImage', 'send image successfully.');
                });
            }
        });
    } else {
        requestUtils.okJsonResponse({
            rc: 1,
            message: 'invalid parameters'
        }, res, 200);
    }
}
