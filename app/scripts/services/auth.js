'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.Auth
 * @description
 * # Auth
 * Factory in the agentUiApp.
 */
angular.module('agentUiApp')
  .factory('Auth', function ($http, $rootScope, $q, AuthToken, API_BASE) {
    var currentUser;

    function login(userName, password) {
      var deferred = $q.defer();
      $http.post(API_BASE + "/login", {
        userName: userName,
        password: password
      }).then(function (result) {
        currentUser = {
          accessToken: result.data.access_token,
          user: result.data.user,
          userName: result.data.user.username
        };
        AuthToken.setToken(result.data.access_token);
        $rootScope.currentUser = currentUser;
        deferred.resolve(currentUser);
      }, function (error) {
        $rootScope.currentUser = null;
        AuthToken.clearToken();
        deferred.reject(error);
      });
      return deferred.promise;
    }

    function logout() {
    }

    function isLoggedIn() {
      var deferred = $q.defer();
      $http.get("/api/users/me")
        .success(function (response) {
          // mean access_token is valid
          $rootScope.currentUser = response.user;
          deferred.resolve(true);
        })
        .error(function () {
          deferred.reject();
        });
      return deferred.promise;
    }

    function currentUser(user) {
      if (user) {
        currentUser = user;
      }
      return currentUser;
    }

    return {
      login: login,
      logout: logout,
      isLoggedIn: isLoggedIn,
      currentUser: currentUser
    };
  });
