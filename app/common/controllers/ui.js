'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:PhoneCtrl
 * @description
 * # PhoneCtrl
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('UIController', function ($scope, UiService,AuthToken) {

    $scope.current = UiService.currentTab;
    $scope.pageTitle = UiService.pageTitle;
    console.log("user isAuthenticated " + AuthToken.isAuthenticated());
    $scope.isAuthenticated = AuthToken.isAuthenticated;

  });
