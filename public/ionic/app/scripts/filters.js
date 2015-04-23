'use strict';
angular.module('iwildfire.filters', [])

.filter('badge', function() {
  return function(input) {
    input = input || '全新';
    var out;
    var list = {
        '全新' : 'qx',
        '很新' : 'hx',
        '完好' : 'wh',
        '适用' : 'sy',
        '能用' : 'ny'
    };
    if ( list[ input ] ) {
        out = 'goods-badge ' + list[ input ];
    }
    return out;
  };
})

.filter('link', function($sce) {
    return function(content) {
        if (typeof content === 'string') {
            var userLinkRegex = /href="\/user\/([\S]+)"/gi;
            var noProtocolSrcRegex = /src="\/\/([\S]+)"/gi;
            var externalLinkRegex = /href="((?!#\/user\/)[\S]+)"/gi;
            return $sce.trustAsHtml(
                content
                .replace(userLinkRegex, 'href="#/user/$1"')
                .replace(noProtocolSrcRegex, 'src="https://$1"')
                .replace(externalLinkRegex, "onClick=\"window.open('$1', '_blank', 'location=yes')\"")
            );
        }
        return content;
    };
})

.filter('tabName', function(Tabs) {
    return function(tab) {
        for (var i in Tabs) {
            if (Tabs[i].value === tab) {
                return Tabs[i].label;
            }
        }
    };
})

.filter('protocol', function() {
    return function(src) {
        // add https protocol
        if (/^\/\//gi.test(src)) {
            return 'https:' + src;
        } else {
            return src;
        }
    };
})

/**
 * A simple relative timestamp filter
 * http://codepen.io/Samurais/pen/PwwLPK
 * https://gist.github.com/Samurais/0c9e81eb18c3d60db46c
 */
.filter('relativets', function() {

    // ms units
    var second = 1000;
    var minute = 60000;
    var hour = 3600000;
    var day = 86400000;
    var year = 31536000000;
    var month = 2592000000;

    function _formatDateString(val) {
        var date = new Date(val);
        var yyyy = date.getFullYear();
        var mm = date.getMonth() + 1; //January is 0!
        var dd = date.getDate();
        var hh = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();

        if (mm < 10) {
            mm = '0' + mm;
        }
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (hh < 10) {
            hh = '0' + hh;
        }
        if (min < 10) {
            min = '0' + min;
        }
        if (sec < 10) {
            sec = '0' + sec;
        }
        return '{0}/{1}/{2} {3}:{4}'.f(yyyy, mm, dd, hh, min);
    };

    return function(value) {
        var diff = new Date() - new Date(value);
        var unit = day;
        var unitStr = '分钟前';
        if (diff > year || diff > month || diff > day) {
            // big gap, just return the absolute time
            return _formatDateString(value);
        } else if (diff > hour) {
            unit = hour;
            unitStr = '小时前';
        } else if (diff > minute) {
            unit = minute;
            unitStr = '分钟前';
        } else {
            unit = second;
            unitStr = '秒前';
        }

        var amt = Math.ceil(diff / unit);
        return amt + '' + unitStr;
    };
})

;
