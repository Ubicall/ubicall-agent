'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:PhoneCtrl
 * @description
 * # MainController
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('MainController', function ($scope, Auth, UiService) {
    if (!Auth.currentUser()) {
      Auth.logout();
    } else {
      UiService.setCurrentTab('main', 'Main Page');
    }
  });
