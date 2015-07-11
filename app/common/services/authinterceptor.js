'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.AuthInterceptor
 * @description
 * # AuthInterceptor
 * Factory in the agentUiApp.
 */
angular.module('agentUiApp')
  .factory('AuthInterceptor', function ($rootScope, $q, AuthToken) {
    return {
      request: function (config) {
        var token = AuthToken.getToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },
      response: function (response) {
        if (!/^2[0-9]{2}$/.test(response.status)) {
          //TODO : log meta info of any non 2XX response code such url ,headers and params
        }
        return response || $q.when(response);
      }
    };
  });
