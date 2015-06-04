'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.AuthToken
 * @description
 * # AuthToken
 * Factory in the agentUiApp.
 */
angular.module('agentUiApp')
  .factory('AuthToken', function (localStorageService, $window) {
    var tokenKey = 'access_token';
    var cachedToken;
    return {
      isAuthenticated: isAuthenticated,
      setToken: setToken,
      getToken: getToken,
      clearToken: clearToken,
      payload: atobPayLoad
    };
    function setToken(token) {
      cachedToken = token;
      localStorageService.set(tokenKey, token);
    }

    function getToken() {
      if (!cachedToken) {
        cachedToken = localStorageService.get(tokenKey);
      }
      return cachedToken;
    }

    function clearToken() {
      cachedToken = null;
      localStorageService.remove(tokenKey);
    }

    function isAuthenticated() {
      return !!getToken();
    }

    function atobPayLoad() {
      var b64 = getToken().split('.')[1];
      return JSON.parse($window.atob(b64));
    }
  });
