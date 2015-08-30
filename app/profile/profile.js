'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:PhoneCtrl
 * @description
 * # agentUiApp
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('ProfileController', function ($scope , $location , $log , Auth , Profile , UiService) {
    if (!Auth.currentUser()) {
      Auth.logout();
    } else {
      $log.info('in profile ');
      UiService.setCurrentTab('profile', 'Profile');
      $scope.user = Profile.get();
      $scope.formData = {};
      $scope.setImage = function(files) {
          $scope.formData.image = files[0];
          Profile.updateUserImage(files[0]).then(function(result){
            //UiService.ok(result.message);
            $location.path('/logout');
          },function(err){
            //UiService.error(err.message);
            $location.path('/main');
          });
      };
      $scope.updateUser = function () {
        Profile.updateUserInfo($scope.formData).then(function(result){
          //UiService.ok(result.message);
          $location.path('/logout');
        },function(err){
          //UiService.error(err.message);
          $location.path('/main');
        });
      };
    }
  });
