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
    'swfobject',
    'lr.upload'
  ]);
angular
  .module('agentUiApp').constant('API_BASE', 'https://agent.ubicall.com/api'); // TODO : standardized url for api in dev and prod (may use config file)
angular
  .module('agentUiApp').constant('FLASH_OBJ_VARS', {rtmp_url : 'rtmp://104.239.164.247/phone'});
angular
    .module('agentUiApp').constant('FLASH_PHONE_ID', 'flashPhone');
angular
        .module('agentUiApp').constant('FLASH_OBJ_PARAMS', {allowScriptAccess: 'always'});
angular
        .module('agentUiApp').constant('MOMENT_DATE_FORMAT', 'dddd, MMMM Do YYYY, h:mm:ss a');
angular
    // if period of call less than next value 'in seconds' it should be retried
    .module('agentUiApp').constant('MAKE_CALL_DONE', 10);
angular
    // if agent to answer in less than next value 'in seconds' , will hangup this call (so it will be retried)
    .module('agentUiApp').constant('AGENT_ANSWER_TIMEOUT', 11);
angular
  .module('agentUiApp').constant('angularMomentConfig', {
    preprocess: 'utc'
  });
angular.module('agentUiApp')
    // lodash support
    .constant('_', window._);


angular.module('agentUiApp').config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('agentUIApp')
    .setStorageType('localStorage')
    .setNotify(true, true);
});

angular.module('agentUiApp').config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'lib/agent/views/login/login.html',
      controller: 'LoginController',
      css: 'lib/agent/css/login.min.css',
      resolve: {
        factory: function ($q, $location, Auth, UiService) {
          // don't load login if user already login 'logout first'
          Auth.isLoggedIn().then(function () {
            $q.defer().reject();
            $location.path("/recent");
          }, function () {
            return true;
          });
        }
      }
    }).when('/logout', {
      templateUrl: 'lib/agent/views/login/login.html',
      controller: 'LoginController',
      css: 'lib/agent/css/login.min.css',
      resolve: {
        factory: function ($q, $location, Auth, rtmp) {
          Auth.logout().then(function () {
            rtmp.logout();
            $location.path("/login");
            $q.defer().reject();
          });
        }
      }
    }).when('/main', {
      templateUrl: 'lib/agent/views/main/main.html',
      resolve: {
        factory: checkRouting
      }
    }).when('/current', {
      templateUrl: 'lib/agent/views/detail/detail.html',
      controller: 'DetailController',
      resolve: {
        factory: checkRouting
      }
    }).when('/recent', {
      templateUrl: 'lib/agent/views/recent/recent.html',
      controller: 'RecentController',
      resolve: {
        factory: checkRouting
      }
    }).when('/call/:queueid/:callid', {
      templateUrl: 'lib/agent/views/detail/detail.html',
      controller: 'DetailController',
      resolve: {
        factory: checkRouting
      }
    }).when('/queue/:queueid/:qslug', {
      templateUrl: 'lib/agent/views/detail/detail.html',
      controller: 'DetailController',
      resolve: {
        factory: checkRouting
      }
    }).when('/me', {
      templateUrl: 'lib/agent/views/profile/profile.html',
      controller: 'ProfileController',
      resolve: {
        factory: checkRouting
      }
    }).when('/reports', {
      templateUrl: 'lib/agent/views/reports/reports.html',
      controller: 'ReportsController',
      resolve: {
        factory: checkRouting
      }
    }).otherwise({
      redirectTo: '/'
    });
});

var checkRouting = function ($q, $location, UiService, Auth, rtmp) {
  Auth.isLoggedIn().then(function yes() {
    return true;
  }, function not() {
    $q.defer().reject();
    rtmp.logout();
    $location.path("/login");
  });
};


angular.module('agentUiApp').config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
  $httpProvider.interceptors.push('callInterceptor');
});
