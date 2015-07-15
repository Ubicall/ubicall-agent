'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:DetailController
 * @description
 * # DetailController
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('DetailController', function ($scope, $location, $routeParams, $log , $filter , helpers ,MOMENT_DATE_FORMAT, UiService, Auth, CallCenter) {
    if (!Auth.currentUser()) {
      Auth.logout();
    } else {
      var CurrentCall;
      var user = Auth.currentUser().user;
      $scope.user = user;

      $scope.isDate = helpers.isDate;

      $scope.isJson = helpers.isJson;

      $scope.isEmptyObject = helpers.isEmptyObject;

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
        call.duration = helpers.diffDates(call.end_time , call.start_time , 'HH:mm:ss');
        call.duration_wait = helpers.diffDates(call.date_end , call.schedule_time , 'MM:DD:HH:mm');
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
