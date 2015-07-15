'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.Auth
 * @description
 * # Auth
 * Factory in the agentUiApp.
 */
angular.module('agentUiApp')
  .factory('Profile', function($http, $log, $q, helpers, AuthToken, API_BASE ) {
    function get() {
      return AuthToken.getCurrentUser();
    }

    function updateUserImage(image) {
      var deferred = $q.defer();
      var fd = new FormData();
      fd.append('image', image , get().name + ".png");
      $http.post(API_BASE + '/users/me/image', fd, {
          headers: {'Content-Type': undefined },
          transformRequest: angular.identity
        })
        .then(function(response) {
          AuthToken.setAvatar(response.data.url);
          deferred.resolve({message : "Your Image Uploaded"});
        }, function(err) {
          deferred.reject({message : 'Unable to Update Your Image'});
        });
      return deferred.promise;
    }

    function updateUserInfo(options) {
      var deferred = $q.defer();
      var changes = {};
      if (!options.credentials.currentPassword) {
        deferred.reject({message : "must add your current password"});
      } else if(!options.credentials.password) {
        deferred.reject({message : "to change your password please provide curent and new one"});
      }else {
        changes.currentPass = options.credentials.currentPassword;
        changes.newPass = options.credentials.password;
        $http.post(API_BASE + "/users/me", changes).then(function(result) {
          deferred.resolve({message : "Your Changes Updated Successfully"});
        }, function(error) {
          deferred.reject({message : "Error Occurred While Updating Your Info"});
        });
      }
      return deferred.promise;
    }

    return {
      get: get,
      updateUserInfo: updateUserInfo,
      updateUserImage: updateUserImage
    };
  });
