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
      payload: atobPayLoad,
      getCurrentUser: currentUser
    };
    function setToken(token) {
      cachedToken = token;
      cachedPayload = null;
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
      if (!cachedPayload && getToken()) {
        var b64 = getToken().split('.')[1];
        cachedPayload = JSON.parse($window.atob(b64));
      }
      return cachedPayload;
    }

    function currentUser() {
      var payload = atobPayLoad();
      if (!payload) {
        return null;
      }
      return {
        email: payload.email || '',
        name: payload.email || '',
        image: payload.img || ''
      }
    }
  });
