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
    'LocalStorageModule',
    'angularUtils.directives.dirPagination',
    'angularMoment',
    'swfobject'
  ]);
angular
  .module('agentUiApp').constant('API_BASE', 'https://agent.ubicall.com/api'); // TODO : standardized url for api in dev and prod (may use config file)
angular
  .module('agentUiApp').constant('FS_RTMP', 'rtmp://104.239.164.247/phone');
angular
  .module('agentUiApp').constant('angularMomentConfig', {
    preprocess: 'utc'
  });


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
      css: 'styles/login.css',
      resolve: {
        factory: function ($q, $location, Auth, alertService) {
          // don't load login if user already login 'logout first'
          Auth.isLoggedIn().then(function () {
            $q.defer().reject();
            alertService.add('info', "you already logged in ");
            $location.path("/recent");
          }, function () {
            return true;
          });
        }
      }
    }).when('/logout', {
      templateUrl: 'views/login.html',
      controller: 'LoginController',
      css: 'styles/login.css',
      resolve: {
        factory: function ($q, $location, Auth, alertService) {
          Auth.logout().then(function () {
            alertService.add('info', "bye ");
            $location.path("/login");
            $q.defer().reject();
          });
        }
      }
    }).when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutController',
      resolve: {
        factory: checkRouting
      }
    }).when('/current', {
      templateUrl: 'views/callDetail.html',
      controller: 'DetailController',
      resolve: {
        factory: checkRouting
      }
    }).when('/recent', {
      templateUrl: 'views/main.html',
      controller: 'MainController',
      css: "styles/main.css",
      resolve: {
        factory: checkRouting
      }
    }).when('/call/:queueid/:callid', {
      templateUrl: 'views/callDetail.html',
      controller: 'DetailController',
      resolve: {
        factory: checkRouting
      }
    }).when('/queue/:queueid/:qslug', {
      templateUrl: 'views/callDetail.html',
      controller: 'DetailController',
      resolve: {
        factory: checkRouting
      }
    }).otherwise({
      redirectTo: '/'
    });
});

var checkRouting = function ($q, $location, alertService, Auth) {
  Auth.isLoggedIn().then(function yes() {
    return true;
  }, function not() {
    $q.defer().reject();
    alertService.add('danger', "unauthorized log in first ");
    $location.path("/login");
  });
};


angular.module('agentUiApp').config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});
