'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:DetailController
 * @description
 * # DetailController
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('DetailController', function ($scope, $location, $routeParams, $filter, UiService, Auth, CallCenter) {
    if (!Auth.currentUser()) {
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
        UiService.ok("new queues available");
      });

      if (/^\/queue/.test($location.path())) {
        UiService.setCurrentTab('current', 'Current Call');
        CallCenter.getMeCall($routeParams.queueid, $routeParams.qslug).then(function (call) {
          $scope.call = call;
          CurrentCall = call;
          // filter current queue from queues
          var _queues = $filter('filter')($scope.queues, !{queue_slug: $routeParams.qslug});
          $scope.queues = _queues;
          if (!$scope.$$phase) {
            $scope.$apply();
          }
        },function(error){
          UiService.error(error.message || "error : unable to get call detail !");
          // hangup from call center if this is not happen from rtmp , this is just for the sake of development
          CallCenter.hangup();
          $location.path('/recent');
          if (!$scope.$$phase) {
            $scope.$apply();
          }
        });
      } else if (/^\/call/.test($location.path())) {
        UiService.setCurrentTab('detail', 'Call Detail');
        CallCenter.getCallDetail($routeParams.queueid, $routeParams.callid).then(function (call) {
          $scope.call = call;
          CurrentCall = call;
        },function(error){
          UiService.error(error.message || "error : unable to get call detail !")
          $location.path('/recent');
          if (!$scope.$$phase) {
            $scope.$apply();
          }
        });
      }
    }
  });
