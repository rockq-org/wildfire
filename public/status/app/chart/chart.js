'use strict';
angular.module('chart', [
  'ionic',
  'ngCordova',
  'ngResource',
  'ui.router',
  'chart.js',
])
.config(function ($stateProvider) {
  $stateProvider
    .state('chart', {
      url: '/chart',
      templateUrl: 'chart/templates/start.html',
      controller: 'StartCtrl as start'
    });
})
.run(function ($state) {
  $state.go('chart');
});
