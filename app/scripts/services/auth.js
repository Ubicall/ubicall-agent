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
    var current_user;

    function login(userName, password) {
      var deferred = $q.defer();
      $http.post(API_BASE + "/login", {
        username: userName,
        password: password
      }).then(function (result) {
        current_user = {
          accessToken: result.data.access_token,
          user: result.data.user,
          username: result.data.user.userName
        };
        AuthToken.setToken(result.data.access_token);
        localStorageService.set('currentUser', current_user)
        $rootScope.currentUser = current_user;
        $rootScope.isLoggedIn = true;
        deferred.resolve(currentUser);
      }, function (error) {
        $rootScope.currentUser = null
        $rootScope.isLoggedIn = false;
        localStorageService.remove('currentUser')
        AuthToken.clearToken();
        deferred.reject(error);
      });
      return deferred.promise;
    }

    function logout() {
      var deferred = $q.defer();
      $http.post(API_BASE + "/logout", {
        access_token: AuthToken.getToken()
      }).error(function (error) {
        $log.debug(error);
      });
      $rootScope.currentUser = null
      $rootScope.isLoggedIn = false;
      current_user = null;
      localStorageService.remove('currentUser')
      AuthToken.clearToken();
      deferred.resolve(true);

      return deferred.promise;
    }

    function isLoggedIn() {
      var deferred = $q.defer();
      $http.get(API_BASE + "/users/me")
        .success(function (response) {
          // mean access_token is valid
          $rootScope.isLoggedIn = true;
          deferred.resolve(true);
        })
        .error(function (error) {
          $rootScope.currentUser = null
          $rootScope.isLoggedIn = false;
          localStorageService.remove('currentUser')
          AuthToken.clearToken();
          deferred.reject(error);
        });
      return deferred.promise;
    }

    function currentUser() {
      return current_user || localStorageService.get('currentUser');
    }

    return {
      login: login,
      logout: logout,
      isLoggedIn: isLoggedIn,
      currentUser: currentUser
    };
  });
