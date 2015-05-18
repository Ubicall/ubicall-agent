'use strict';

/**
 * @ngdoc overview
 * @name agentUiApp
 * @description
 * # agentUiApp
 *
 * Main module of the application.
 */
angular
  .module('agentUiApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'door3.css',
    'LocalStorageModule'
  ]);
angular
  .module('agentUiApp').constant('API_BASE', 'http://agent.sandcti.com:3000/api');

angular.module('agentUiApp').config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('agentUIApp')
    .setStorageType('localStorage')
    .setNotify(true, true);
});

angular.module('agentUiApp').config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/login.html',
      controller: 'LoginController',
      css: 'styles/login.css'
    })
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutController'
    }).when('/main', {
      templateUrl: 'views/main.html',
      controller: 'MainController',
      css:"styles/main.css",
    }).otherwise({
      redirectTo: '/'
    });
});


angular.module('agentUiApp').config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});
