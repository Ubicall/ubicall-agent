'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('QueuesController', function ($scope, $location, Auth, CallCenter, UiService, moment, amMoment) {
    if (!Auth.currentUser()) {
      Auth.logout().then(function () {
        $location.path("/login");
      })
    } else {
      var _user = Auth.currentUser().user;
      var _queues, _totalQueues;

      $scope.queuesCurrentPage = 1;
      $scope.queuesPageSize = 10;

      $scope.user = _user;

      $scope.queues = _queues = [];
      $scope.totalQueues = _totalQueues = 0;

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

      $scope.$on('queues:updated', function (event, queues) {
        $scope.totalQueues = _totalQueues = queues.length;
        $scope.queues = _queues = queues;
        UiService.ok(" new queues available ");
      });

      $scope.$on("rtmp:login", function (event, loginInfo) {
        console.log("loginInfo is " + loginInfo);
      });
    }
  });
