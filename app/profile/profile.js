'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:PhoneCtrl
 * @description
 * # agentUiApp
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('ProfileController', function ($scope, UiService) {
    if (!Auth.currentUser()) {
      Auth.logout().then(function () {
        $location.path("/login");
      });
    } else {
      UiService.setCurrentTab('profile', 'Your Profile');
    }
  });
