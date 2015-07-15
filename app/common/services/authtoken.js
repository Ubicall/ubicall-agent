'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.AuthToken
 * @description
 * # AuthToken
 * Factory in the agentUiApp.
 */
angular.module('agentUiApp')
  .factory('AuthToken', function ($window ,localStorageService, AGENT_DEFAULT_AVATAR) {
    var tokenKey = 'access_token';
    var cachedToken;
    var cachedPayload;
    return {
      isAuthenticated: isAuthenticated,
      setToken: setToken,
      getToken: getToken,
      clearToken: clearToken,
      payload: atobPayLoad,
      getCurrentUser: currentUser,
      setAvatar: setAvatar
    };
    function setToken(token) {
      cachedToken = token;
      cachedPayload = null;
      localStorageService.set(tokenKey, token);
      setAvatar(atobPayLoad().image);
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

    function setAvatar(avatar){
      localStorageService.set('avatar', avatar);
    }

    function _getAvatar(payload){
      return  localStorageService.get('avatar') || payload.image || AGENT_DEFAULT_AVATAR ;
    }

    function currentUser() {
      var payload = atobPayLoad();
      if (!payload) {
        return null;
      }
      return {
        email: payload.email || '',
        name: payload.email || '',
        image: _getAvatar(payload)
      }
    }
  });
