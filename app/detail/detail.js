'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:DetailController
 * @description
 * # DetailController
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('DetailController', function ($scope, $location, $routeParams, $log , $filter , MOMENT_DATE_FORMAT, UiService, Auth, CallCenter) {
    if (!Auth.currentUser()) {
      Auth.logout();
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

      var peautifyCall = function (call){

        call.duration = moment.utc(moment(call.date_end).diff(moment(call.date_init))).format('MM:DD:HH:mm');
        call.duration_wait = moment.utc(moment(call.date_end).diff(moment(call.schedule_time))).format('MM:DD:HH:mm');

        call.schedule_time = moment(call.schedule_time).format(MOMENT_DATE_FORMAT);
        call.start_time = moment(call.start_time).format(MOMENT_DATE_FORMAT);
        call.end_time = moment(call.end_time).format(MOMENT_DATE_FORMAT);
        call.date_init = moment(call.date_init).format(MOMENT_DATE_FORMAT);
        call.date_end = moment(call.date_end).format(MOMENT_DATE_FORMAT);
        call.datetime_originate = moment(call.datetime_originate).format(MOMENT_DATE_FORMAT);
        
        return call;
      }
      if (/^\/queue/.test($location.path())) {
        UiService.setCurrentTab('current', 'Current Call');
        CallCenter.getMeCall($routeParams.queueid, $routeParams.qslug).then(function (call) {
          call = peautifyCall(call);
          $scope.call = call;
          CurrentCall = call;
        },function(error){
          UiService.error(error.message);
        });
      } else if (/^\/call/.test($location.path())) {
        UiService.setCurrentTab('detail', 'Call Detail');
        CallCenter.getCallDetail($routeParams.queueid, $routeParams.callid).then(function (call) {
          call = peautifyCall(call);
          $scope.call = call;
          CurrentCall = call;
        },function(error){
          UiService.error(error.message || "unable to get call detail !")
          $location.path('/recent');
        });
      }
    }
  });
