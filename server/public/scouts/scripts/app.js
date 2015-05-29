'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  // TODO: load other modules selected during generation
])
.config(function ($stateProvider, $urlRouterProvider) {

  // console.log('Allo! Allo from your module: ' + 'main');

  $urlRouterProvider.otherwise('/main');

  // some basic routing
  $stateProvider
    .state('main', {
      url: '/main',
      templateUrl: 'main/templates/start.html',
      controller: 'StartCtrl as start'
    });
  // TODO: do your thing
});

'use strict';
angular.module('main')
.service('Start', function () {
  console.log('Hello from your Service: Start in module main');

  // some initial data
  this.someData = {
    binding: 'Yes! Got that databinding working'
  };

  // TODO: do your service thing
});

'use strict';
angular.module('main')
.controller('StartCtrl', function (Start, Config) {

  // bind data from service
  this.someData = Start.someData;
  this.ENV = Config.ENV;
  this.BUILD = Config.BUILD;

  console.log('Hello from your Controller: StartCtrl in module main:. This is your controller:', this);
  // TODO: do your controller thing
});

'use strict';
angular.module('main')
.constant('Config', {

  // gulp environment: injects environment vars
  // https://github.com/mwaylabs/generator-m#gulp-environment
  ENV: {
    /*inject-env*/
    'API': 'api/v1/'
    /*endinject*/
  },

  // gulp build-vars: injects build vars
  // https://github.com/mwaylabs/generator-m#gulp-build-vars
  BUILD: {
    /*inject-build*/
    /*endinject*/
  }

});

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

'use strict';
angular.module('chart')
.controller('StartCtrl', function (Subscription, Config, $scope) {
  Subscription.getChartData().then(function (data) {
    $scope.chartData = data;
  });
});

'use strict';
angular.module('chart')
.constant('Config', {

  // gulp environment: injects environment vars
  // https://github.com/mwaylabs/generator-m#gulp-environment
  ENV: {
    /*inject-env*/
    'API': 'api/v1/'
    /*endinject*/
  },

  // gulp build-vars: injects build vars
  // https://github.com/mwaylabs/generator-m#gulp-build-vars
  BUILD: {
    /*inject-build*/
    /*endinject*/
  }

});

'use strict';
angular.module('status', [
  // your modules
  'chart'
]);
