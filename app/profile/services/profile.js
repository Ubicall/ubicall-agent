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

    function updateUserInfo(options) {
      var deferred = $q.defer();
      if (!options.credentials.currentPassword) {
        deferred.reject({message : "must add your current password"});
      } else if(!options.credentials.password && !options.image) {
        deferred.reject({message : "no changes to modify"});
      }else {
        var changes = new FormData();
        changes.append('currentPass' , options.credentials.currentPassword);
        if(options.credentials.password){
          changes.append('newPass' , options.credentials.password);
        }
        if(options.image){
          changes.append('image', options.image , get().name + ".png");
        }

        $http.post(API_BASE + "/users/me", changes, {
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
          }).then(function(result) {
          deferred.resolve({message : "Your Changes Updated Successfully"});
        }, function(error) {
          deferred.reject({message : "Error Occurred While Updating Your Info"});
        });
      }
      return deferred.promise;
    }

    return {
      get: get,
      updateUserInfo: updateUserInfo
    };
  });
