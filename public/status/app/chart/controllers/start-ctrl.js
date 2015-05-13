'use strict';
angular.module('chart')
.controller('StartCtrl', function (Subscription, Config, $scope) {
  $scope.labels = [];
  $scope.series = [];
  $scope.data = [];

  Subscription.getData('贸大').then(function (data) {
    $scope.series.push(data.labelName);
    $scope.labels = data.labels;
    $scope.data.push(data.data);
  });

  Subscription.getData('燕大').then(function (data) {
    $scope.series.push(data.labelName);
    $scope.labels = data.labels;
    $scope.data.push(data.data);
  });

});
