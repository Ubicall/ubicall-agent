'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('MainController', function ($scope, $location, Auth, CallCenter, alertService) {
    if (!Auth.currentUser() || !Auth.currentUser().user) {
      Auth.logout().then(function () {
        $location.path("/login");
      })
    } else {
      var _user = Auth.currentUser().user;
      var _calls, _totalCalls, _queues;
      $scope.user = _user;

      $scope.calls = _calls = [];
      $scope.queues = _queues = [];
      $scope.totalCalls = _totalCalls = 0;

      CallCenter.getAvailableCalls().then(function (calls) {
        _totalCalls = calls.length;
        $scope.totalCalls = _totalCalls;
        _calls = calls;
        $scope.calls = _calls;
      });
      CallCenter.getQueues().then(function (queues) {
        _queues = queues;
        $scope.queues = _queues;
      });

      $scope.$on('calls:updated', function (event, calls) {
        $scope.totalCalls = _totalCalls = calls.length;
        $scope.calls = _calls = calls;
        alertService.add("success", " new call available ");
      });


      $scope.pageChanged = function (newPage) {
        console.log("new page is " + newPage + " calls is " + _calls);

      };
    }
  });
