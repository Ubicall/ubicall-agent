'use strict';

angular.module('agentUiApp')
  .controller('AlertController', function ($scope) {
    $scope.alerts = [
      {type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.'},
      {type: 'success', msg: 'Well done! You successfully read this important alert message.'}
    ];

    $scope.addAlert = function (type ,message) {
      $scope.alerts.push({msg: 'Another alert!'});
    };

    $scope.closeAlert = function (index) {
      $scope.alerts.splice(index, 1);
    };
  });
