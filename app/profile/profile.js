'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:PhoneCtrl
 * @description
 * # agentUiApp
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('ProfileController', function ($scope,UiService) {

    UiService.setCurrentTab('profile', 'Your Profile');

  });
