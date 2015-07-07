'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.Auth
 * @description
 * # Auth
 * Factory in the agentUiApp.
 */
angular.module('agentUiApp')
  .factory('Auth', function ($http, $rootScope, $log, $q, localStorageService, AuthToken, API_BASE) {
    function login(userName, password) {
      var deferred = $q.defer();
      $http.post(API_BASE + "/login", {
        username: userName,
        password: password
      }).then(function (result) {
        AuthToken.setToken(result.data.access_token);
        $rootScope.$broadcast("Auth:login", {username: userName});
        deferred.resolve({});
      }, function (error) {
        AuthToken.clearToken();
        deferred.reject(error);
      });
      return deferred.promise;
    }

    function logout() {
      var deferred = $q.defer();
      $rootScope.$broadcast("Auth:logout");
      $http.post(API_BASE + "/logout", {
        access_token: AuthToken.getToken()
      }).error(function (error) {
        $log.debug(error);
      });
      AuthToken.clearToken();
      deferred.resolve(true);
      return deferred.promise;
    }

    function isLoggedIn() {
      var deferred = $q.defer();
      if (AuthToken.getToken()) {
        deferred.resolve(true);
      } else {
        deferred.reject(false);
      }
      return deferred.promise;
    }


    return {
      login: login,
      logout: logout,
      isLoggedIn: isLoggedIn,
      currentUser: AuthToken.getCurrentUser
    };
  });
