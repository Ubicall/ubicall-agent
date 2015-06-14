'use strict';

angular.module('agentUiApp')
  .controller('AlertController', function ($scope, UiService) {
    $scope.alerts = [];


    $scope.closeAlert = function (index) {
      UiService.closeAlertIdx(index);
    };

    $scope.$on('alert:notify', function (event, alerts) {
      $scope.alerts = alerts;
      console.log("alerts is " + JSON.stringify(alerts));
    });
  });
