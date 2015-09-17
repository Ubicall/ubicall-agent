'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('QueuesController', function ($scope, $location , $timeout , $log , Auth, CallCenter , moment, amMoment) {
    if (!Auth.currentUser()) {
      Auth.logout();
    } else {

      CallCenter.getQueues().then(function(queues){
        $log.info("available queues is " + JSON.stringify(queues));
        $scope.queues = queues;
      });

      $scope.$on('queues:updated', function (event, queues) {
        CallCenter.getQueues().then(function(queues){
          $log.info("queues updated : " + JSON.stringify(queues));
          $scope.queues = queues;
        });
      });
    }
  });
