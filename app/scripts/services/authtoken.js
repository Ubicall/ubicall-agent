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
    var cachedPayload;
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
      if (!cachedPayload) {
        var b64 = getToken().split('.')[1];
        cachedPayload = JSON.parse($window.atob(b64));
      }
      return cachedPayload;
    }
  });
