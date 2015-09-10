'use strict';

/**
 * @ngdoc overview
 * @name agentUiApp
 * @description
 * # agentUiApp
 *
 * Main module of the application.
 */
var AgentStaticHost = "https://cdn.ubicall.com/agent/" ;
var TemplateMainUrl = AgentStaticHost + "views/" ;
var CDNStaticHost = "https://cdn.ubicall.com/static/" ;
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
    'notifications',
    'ngNotify'
  ]);
angular
  .module('agentUiApp').constant('API_BASE', 'https://agent.ubicall.com/api/v1'); // TODO : standardized url for api in dev and prod (may use config file)
angular
  .module('agentUiApp').constant('FLASH_OBJ_VARS', {rtmp_url : 'rtmp://104.239.164.247/phone'});
angular
    .module('agentUiApp').constant('FLASH_PHONE_ID', 'flashPhone');
angular
      .module('agentUiApp').constant('FLASH_OBJ_PARAMS', {allowScriptAccess: 'always'});
angular
      .module('agentUiApp').constant('FLASH_EXPRESS_INSTALL', 'https://cdn.ubicall.com/static/swfobject/swfobject/expressInstall.swf');
angular
        .module('agentUiApp').constant('MOMENT_DATE_FORMAT', 'dddd, MMMM Do YYYY, h:mm:ss a');
angular
    // if period of call less than next value 'in seconds' it should be retried
    .module('agentUiApp').constant('MAKE_CALL_DONE', 10);
angular
    // if agent to answer in less than next value 'in seconds' , will hangup this call (so it will be retried)
    .module('agentUiApp').constant('AGENT_ANSWER_TIMEOUT', 11);
angular
    // if agent to answer in less than next value 'in seconds' , will hangup this call (so it will be retried)
    .module('agentUiApp').constant('AGENT_DEFAULT_AVATAR', 'https://cdn.ubicall.com/static/ubicall/images/user.png');
angular
  .module('agentUiApp').constant('angularMomentConfig', {
    preprocess: 'utc'
  });
angular.module('agentUiApp')
    // lodash support
    .constant('_', window._);
angular.module('agentUiApp')
    // lodash support
    .constant('_swfobject', window.swfobject);


angular.module('agentUiApp').config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('agentUIApp')
    .setStorageType('localStorage')
    .setNotify(true, true);
});

angular.module('agentUiApp').config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: TemplateMainUrl + 'login/login.html',
    controller: 'LoginController',
    resolve: {
      factory: function ($q, $location, Auth, UiService) {
        // don't load login if user already login 'logout first'
        Auth.isLoggedIn().then(function () {
          $q.defer().reject();
          $location.path("/main");
        }, function () {
          $location.path("/login");
        });
      }
    }
  }).when('/login', {
      templateUrl: TemplateMainUrl + 'login/login.html',
      controller: 'LoginController',
      resolve: {
        factory: function ($q, $location, Auth, UiService) {
          // don't load login if user already login 'logout first'
          Auth.isLoggedIn().then(function () {
            $q.defer().reject();
            $location.path("/main");
          }, function () {
            return true;
          });
        }
      }
    }).when('/logout', {
      templateUrl: TemplateMainUrl + 'login/login.html',
      controller: 'LoginController',
      resolve: {
        factory: function ($q, $location, Auth, rtmp) {
          Auth.logout().then(function () {
            rtmp.logout();
            $location.path("/login");
            $q.defer().reject();
          });
        }
      }
    }).when('/forget_password', {
      templateUrl: TemplateMainUrl + 'login/forget.html',
      controller: 'LoginController',
    }).when('/main', {
      templateUrl: TemplateMainUrl + 'main/main.html',
      controller: 'MainController',
      resolve: {
        factory: checkRouting
      }
    }).when('/current', {
      templateUrl: TemplateMainUrl + 'detail/detail.html',
      controller: 'DetailController',
      resolve: {
        factory: checkRouting
      }
    }).when('/recent', {
      templateUrl: TemplateMainUrl + 'recent/recent.html',
      controller: 'RecentController',
      resolve: {
        factory: checkRouting
      }
    }).when('/call/:queueid/:callid', {
      templateUrl: TemplateMainUrl + 'detail/detail.html',
      controller: 'DetailController',
      resolve: {
        factory: checkRouting
      }
    }).when('/queue/:queueid/:qslug', {
      templateUrl: TemplateMainUrl + 'detail/detail.html',
      controller: 'DetailController',
      resolve: {
        factory: checkRouting
      }
    }).when('/me', {
      templateUrl: TemplateMainUrl + 'profile/profile.html',
      controller: 'ProfileController',
      resolve: {
        factory: checkRouting
      }
    }).when('/reports', {
      templateUrl: TemplateMainUrl + 'reports/reports.html',
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

angular.module('agentUiApp').config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our agent cdn.
    AgentStaticHost + '**',
    // Allow loading from our generic cdn.
    CDNStaticHost + "**",
  ]);
});
