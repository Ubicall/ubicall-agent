'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:PhoneCtrl
 * @description
 * # MainController
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('MainController', function ($scope,UiService) {
    $scope.current = "main";
    UiService.setCurrentTab('main', 'Main Page');

  });
