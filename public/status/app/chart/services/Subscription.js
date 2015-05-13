'use strict';
angular.module('chart')
.service('Subscription', function ($resource, Config, $q) {
  var url = Config.ENV.API + 'statistics/subscription';
  var paramDefaults = null;

  var actions = {
    // 'getData': {method: 'POST', params: {}}
  };
  var $Subscription = $resource(url, paramDefaults, actions);

  $Subscription.getData = function (source) {
    var d = $q.defer();
    var postData = { source: source };
    $Subscription.save(postData, function (data) {
      var labels = data.msg.labels;
      var labelName = source;
      var theData = data.msg.datasets[0].data;

      var start = '2015-04-'.length;
      var end = start + 2;
      for(var i in labels) {
        labels[i] = labels[i].substring(start, end);
      }

      d.resolve({
        labelName: labelName,
        labels: labels,
        data: theData
      });
    });

    return d.promise;
  };

  return $Subscription;
});
