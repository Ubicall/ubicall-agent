'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('AboutController', function ($scope, $location, Auth) {
    if (!Auth.currentUser() || !Auth.currentUser().user) {
      Auth.logout().then(function () {
        $location.path("/login");
      })
    }
    var user = Auth.currentUser().user;
    $scope.user = user;
  });
