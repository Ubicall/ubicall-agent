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
      };
      $scope.updateUser = function () {
        $log.info('in profile updateUser ');
        Profile.update($scope.formData).then(function(done){
          $location.path('/main');
        },function(err){
          $log.info('in profile ');
          $log.error(err);
          $location.path('/main');
        })
      };
    }
  });
