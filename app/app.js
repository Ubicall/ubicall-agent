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
      templateUrl: 'login/login.html',
      controller: 'LoginController',
      css: 'login/login.css',
      resolve: {
        factory: function ($q, $location, Auth, UiService) {
          // don't load login if user already login 'logout first'
          Auth.isLoggedIn().then(function () {
            $q.defer().reject();
            //UiService.add('info', "you already logged in ");
            $location.path("/recent");
          }, function () {
            return true;
          });
        }
      }
    }).when('/logout', {
      templateUrl: 'login/login.html',
      controller: 'LoginController',
      css: 'login/login.css',
      resolve: {
        factory: function ($q, $location, Auth, UiService) {
          Auth.logout().then(function () {
            UiService.add('info', "bye ");
            $location.path("/login");
            $q.defer().reject();
          });
        }
      }
    }).when('/main', {
      templateUrl: 'main/main.html',
      resolve: {
        factory: checkRouting
      }
    }).when('/current', {
      templateUrl: 'detail/detail.html',
      controller: 'DetailController',
      resolve: {
        factory: checkRouting
      }
    }).when('/recent', {
      templateUrl: 'recent/recent.html',
      controller: 'RecentController',
      resolve: {
        factory: checkRouting
      }
    }).when('/call/:queueid/:callid', {
      templateUrl: 'detail/detail.html',
      controller: 'DetailController',
      resolve: {
        factory: checkRouting
      }
    }).when('/queue/:queueid/:qslug', {
      templateUrl: 'detail/detail.html',
      controller: 'DetailController',
      resolve: {
        factory: checkRouting
      }
    }).otherwise({
      redirectTo: '/'
    });
});

var checkRouting = function ($q, $location, UiService, Auth) {
  Auth.isLoggedIn().then(function yes() {
    return true;
  }, function not() {
    $q.defer().reject();
    UiService.add('danger', "unauthorized log in first ");
    $location.path("/login");
  });
};


angular.module('agentUiApp').config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
  $httpProvider.interceptors.push('callInterceptor');
});
