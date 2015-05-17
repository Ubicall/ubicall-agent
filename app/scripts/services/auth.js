'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.Auth
 * @description
 * # Auth
 * Factory in the agentUiApp.
 */
angular.module('agentUiApp')
  .factory('Auth', function ($http, $q, AuthToken) {
    var userInfo;

    function login(userName, password, API_BASE) {
      var deferred = $q.defer();

      $http.post("API_BASE/login", {
        userName: userName,
        password: password
      }).then(function (result) {
        userInfo = {
          accessToken: result.data.access_token,
          userName: result.data.userName
        };
        AuthToken.setToken(JSON.stringify(userInfo));
        deferred.resolve(userInfo);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }

    return {
      login: login
    };
  });
