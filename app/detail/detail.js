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

      $scope.isDate = function (value){
        // see http://stackoverflow.com/a/1353710
        // not use angular.isDate https://github.com/angular/angular.js/blob/master/src/Angular.js#L583
        return !isNaN( Date.parse(value) );
      }

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

      $scope.isEmptyObject = function(obj){
          if(obj){
            return Object.keys(obj).length === 0 ? true : false;
          }else {
            return true;
          }
      }

      var parseCallDate = function(call){
        if(call.call_data instanceof Object){
          return call;
        }
        try {
            var v = JSON.parse(call.call_data);
            if (v && v instanceof Array){
              call.call_data = (v.length > 0) ? v[0] : null;
            }else if (v && v instanceof Object) {
              call.call_data = v;
            }else {
              call.call_data = null;
            }
          } catch (e) {
            call.call_data = null;
          }
        return call;
      }

      var formatCallDuration = function (call){
        call.duration = moment.utc(moment(call.end_time).diff(moment(call.start_time))).format('HH:mm:ss');
        call.duration_wait = moment.utc(moment(call.date_end).diff(moment(call.schedule_time))).format('MM:DD:HH:mm');
        return call;
      }

      if (/^\/queue/.test($location.path())) {
        UiService.setCurrentTab('current', 'Current Call');
        CallCenter.getMeCall($routeParams.queueid, $routeParams.qslug).then(function (call) {
          call = parseCallDate(call);
          $scope.call = call;
          CurrentCall = call;
        },function(error){
          UiService.error(error.message);
        });
      } else if (/^\/call/.test($location.path())) {
        UiService.setCurrentTab('detail', 'Call Detail');
        CallCenter.getCallDetail($routeParams.queueid, $routeParams.callid).then(function (call) {
          call = formatCallDuration(call);
          call = parseCallDate(call);
          $scope.call = call;
          CurrentCall = call;
        },function(error){
          UiService.error(error.message || "unable to get call detail !")
          $location.path('/recent');
        });
      }
    }
  });
