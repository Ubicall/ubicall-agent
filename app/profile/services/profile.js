'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.Auth
 * @description
 * # Auth
 * Factory in the agentUiApp.
 */
angular.module('agentUiApp')
  .factory('Profile', function($http, $log, $q, helpers, AuthToken, API_BASE) {
    function get() {
      return AuthToken.getCurrentUser();
    }

    function _uploadUserImage(image) {
      var deferred = $q.defer();
      var fd = new FormData();
      fd.append('image', image , get().name + ".png");
      $http.post(API_BASE + '/users/me/image', fd, {
          headers: {'Content-Type': undefined },
          transformRequest: angular.identity
        })
        .then(function(response) {
          console.log(response.data);
          deferred.resolve(response.data.url);
        }, function(err) {
          console.error(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    // user info to be updated {currentPass : xxx , [newPass :YYY  || image : URL]}
    function _updateUserInfo(user) {
      var deferred = $q.defer();
      if (!helpers.isEmptyObject(user)) {
        $http.post(API_BASE + "/users/me", user).then(function(result) {
          deferred.resolve({});
        }, function(error) {
          deferred.reject(error);
        });
      } else {
        deferred.reject("no changes to update");
      }
      return deferred.promise;
    }

    function update(options) {
      var deferred = $q.defer();
      var changes = {};
      if (!options.credentials.currentPassword) {
        deferred.reject("must add your old password");
      } else {
        changes.currentPass = options.credentials.currentPassword;
        if (options.credentials.password) {
          changes.newPass = options.credentials.password;
        }
        if (options.image) {
          _uploadUserImage(options.image).then(function(url) {
            changes.image = url;
            deferred.resolve(_updateUserInfo(changes));
          }, function(err) {
            $log.error(err);
            deferred.reject(err);
          })
        } else {
          deferred.resolve(_updateUserInfo(changes));
        }
      }
      return deferred.promise;
    }

    return {
      get: get,
      update: update,
    };
  });
