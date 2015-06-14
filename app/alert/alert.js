'use strict';

angular.module('agentUiApp')
  .controller('AlertController', function ($scope, alertService) {
    $scope.alerts = alertService.get();


    $scope.closeAlert = function (index) {
      alertService.closeAlertIdx(index);
    };

    $scope.$on('notify', function (event, alerts) {
      $scope.alerts = alerts;
      console.log("alerts is " + JSON.stringify(alerts));
    });
  });
