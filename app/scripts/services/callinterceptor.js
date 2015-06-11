'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.callInterceptor
 * @description
 * # callInterceptor
 * Factory in the agentUiApp.
 */
angular.module('agentUiApp')
  .factory('callInterceptor', function (rtmp) {
    return {
      request: function (config) {
        if (config.url.includes('/call/')) {
          config.headers = config.headers || {};
          config.headers['x-rtmp-session'] = rtmp.me();
        }
        return config;
      }
    };
  });
