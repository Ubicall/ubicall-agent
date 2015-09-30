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
      $http.post(API_BASE + "/auth/token", {
        client_id: 'ubicall-agent',
        email: userName,
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
      var token = AuthToken.getToken();
      if(token){
        $http.delete(API_BASE + "/auth/revoke", {
          access_token: token
        }).error(function (error) {
          $log.debug(error);
        });
      }
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

    function forgetPassword(email){
        var deferred = $q.defer();
        if(!email){
          deferred.reject("email is required");
        }
        $http.post(API_BASE + "/agent/forget", {
          email: email
        }).then(function (result) {
          deferred.resolve(result);
        }, function (error) {
          deferred.reject(error);
        });
        return deferred.promise;
    }

    return {
      login: login,
      logout: logout,
      isLoggedIn: isLoggedIn,
      forgetPassword: forgetPassword,
      currentUser: AuthToken.getCurrentUser
    };
  });
