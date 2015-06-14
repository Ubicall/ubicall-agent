'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:PhoneCtrl
 * @description
 * # PhoneCtrl
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('UIController', function ($scope, UiService) {

    $scope.current = UiService.currentTab();
    $scope.pageTitle = UiService.pageTitle();

  });
