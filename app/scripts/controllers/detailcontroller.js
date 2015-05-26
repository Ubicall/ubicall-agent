'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:DetailController
 * @description
 * # DetailController
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('DetailController', function ($scope, $location, $routeParams, Auth, CallCenter) {
    if (!Auth.currentUser() || !Auth.currentUser().user) {
      Auth.logout().then(function () {
        $location.path("/login");
      })
    }
    var user = Auth.currentUser().user;
    $scope.user = user;
    $scope.call = $scope.queues = [];
    CallCenter.getCallDetail($routeParams.queueid, $routeParams.callid).then(function (call) {
      $scope.call = call;
    });
    CallCenter.getQueues().then(function (queues) {
      $scope.queues = queues;
    });
  });
