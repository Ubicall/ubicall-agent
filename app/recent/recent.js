'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('RecentController', function ($scope, $location, Auth, CallCenter, UiService, moment, amMoment) {
    UiService.setCurrentTab('recent', 'Recent Calls');
    if (!Auth.currentUser()) {
      Auth.logout().then(function () {
        $location.path("/login");
      })
    } else {
      var _user = Auth.currentUser().user;
      var _calls, _totalCalls, _queues, _totalQueues;

      $scope.queuesCurrentPage = 1;
      $scope.queuesPageSize = 10;

      $scope.callsCurrentPage = 1;
      $scope.callsPageSize = 10;

      $scope.user = _user;

      $scope.calls = _calls = [];
      $scope.queues = _queues = [];
      $scope.totalCalls = _totalCalls = 0;
      $scope.totalQueues = _totalQueues = 0;

      CallCenter.getAvailableCalls().then(function (calls) {
        _totalCalls = calls.length;
        $scope.totalCalls = _totalCalls;
        _calls = calls;
        $scope.calls = _calls;
      });
      CallCenter.getQueues().then(function (queues) {
        _totalQueues = queues.length;
        $scope.totalQueues = _totalQueues;
        _queues = queues;
        $scope.queues = _queues;
      });


      $scope.fromNow = function (utcend, utcstart) {
        return moment.utc(moment(utcend, "DD/MM/YYYY HH:mm:ss").
          diff(moment(utcstart, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
      };
      $scope.$on('calls:updated', function (event, calls) {
        $scope.totalCalls = _totalCalls = calls.length;
        $scope.calls = _calls = calls;
      });

      $scope.$on('queues:updated', function (event, queues) {
        $scope.totalQueues = _totalQueues = queues.length;
        $scope.queues = _queues = queues;
      });

      $scope.$on("rtmp:login", function (event, loginInfo) {
        console.log("loginInfo is " + loginInfo);
      });
    }
  });
