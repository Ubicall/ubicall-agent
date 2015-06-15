'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:DetailController
 * @description
 * # DetailController
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('DetailController', function ($scope, $location, $routeParams, UiService, Auth, CallCenter) {
    if (!Auth.currentUser() || !Auth.currentUser().user) {
      Auth.logout().then(function () {
        $location.path("/login");
      })
    } else {
      var CurrentCall;
      var user = Auth.currentUser().user;
      $scope.user = user;

      var _queues, _totalQueues;
      $scope.queues = _queues = [];
      $scope.totalQueues = _totalQueues = 0;


      $scope.queuesCurrentPage = 1;
      $scope.queuesPageSize = 10;


      CallCenter.getQueues().then(function (queues) {
        $scope.queues = queues;
      });

      $scope.isJson = function (str) {
        if (!str || isNumber(str)) {
          return false;
        }
        if (typeof str == 'object') {
          return true;
        }
        try {
          JSON.parse(str);
        } catch (e) {
          return false;
        }
        return true;
      };

      var isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      };

      $scope.$on('queues:updated', function (event, queues) {
        $scope.totalQueues = _totalQueues = queues.length;
        $scope.queues = _queues = queues;
        UiService.add("success", " new queues available ");
      });

      $scope.$on('rtmp:call:hangup', function (event, message) {
       // update currentCall status and push to server
      });

      if (/^\/queue/.test($location.path())) {
        UiService.setCurrentTab('current', 'Current Call');
        CallCenter.getMeCall($routeParams.queueid, $routeParams.qslug).then(function (call) {
          $scope.call = call;
          CurrentCall = call;
        });
      } else if (/^\/call/.test($location.path())) {
        UiService.setCurrentTab('detail', 'Call Detail');
        CallCenter.getCallDetail($routeParams.queueid, $routeParams.callid).then(function (call) {
          $scope.call = call;
          CurrentCall = call;
        });
      }
    }
  });
