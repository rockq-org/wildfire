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
      for (var i in labels) {
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

  $Subscription.getChartData = function () {
    var d = $q.defer();
    $q.all([$Subscription.getData('贸大'), $Subscription.getData('燕大')]).then(function (results) {
      var data, labels, series;
      var baseSumData = 0;
      var sumChartData = {
        labelName: '总用户',
        labels: [],
        data: []
      };

      sumChartData.labels = results[0].labels;
      for (var i in results[0].data) {
        baseSumData += results[0].data[i] + results[1].data[i];
        sumChartData.data.push(baseSumData);
      }

      data = [sumChartData.data, results[0].data, results[1].data];
      labels = results[0].labels;
      series = [sumChartData.labelName, results[0].labelName, results[1].labelName];

      var chartData = {
        data: data,
        labels: labels,
        series: series
      };
      d.resolve(chartData);
    });

    return d.promise;
  };

  return $Subscription;
});
