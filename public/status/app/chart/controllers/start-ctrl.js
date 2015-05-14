'use strict';
angular.module('chart')
.controller('StartCtrl', function (Subscription, Config, $scope) {
  Subscription.getChartData().then(function (data) {
    $scope.chartData = data;
  });
});
