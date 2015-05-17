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
    'door3.css',
    'LocalStorageModule'
  ]);
angular
  .module('agentUiApp').constant('API_BASE', 'http://agent.sandcti.com:3000/api/');

angular.module('agentUiApp').config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('agentUIApp')
    .setStorageType('localStorage')
    .setNotify(true, true);
}).config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl',
      css: 'styles/login.css'
    })
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl'
    }).when('/main', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    }).otherwise({
      redirectTo: '/'
    });
});

