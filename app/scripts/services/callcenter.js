'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.CallCenter
 * @description
 * # CallCenter
 * Service in the agentUiApp.
 */
angular.module('agentUiApp')
  .service('CallCenter', function ($http, $rootScope, $log, $q, localStorageService, AuthToken, API_BASE) {
    var CallCenter = {};
//TODO :Use https://github.com/jmdobry/angular-cache instead
    var calls, queues ;

    function _getCalls() {
      var deferred = $q.defer();
      if (calls) {
        deferred.resolve(calls);
      }
      $http.get(API_BASE + "/calls").then(function (result) {
        calls = result.data;
        deferred.resolve(result.data);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }

    function _getCall(callid, queueid) {
      var deferred = $q.defer();
      angular.forEach(calls, function (_call) {
        if (_call.id == callid && _call.queue_id == queueid) {
          deferred.resolve(_call);
        }
      });
      return deferred.promise;
    }

    CallCenter.getAvailableCalls = function () {
      // moved to separate function , to call it from #getCallDetail
      return _getCalls();
    };

    CallCenter.getCallDetail = function (queueid, callid) {
      var deferred = $q.defer();
      if (!calls) {
        return _getCalls().then(function () {
          return _getCall(callid, queueid);
        });
      }
      return _getCall(callid, queueid);
    };

    CallCenter.getQueues = function () {
      var deferred = $q.defer();
      if (queues) {
        deferred.resolve(queues);
      }
      $http.get(API_BASE + "/queues").then(function (result) {
        queues = result.data;
        deferred.resolve(result.data);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };


    return CallCenter;
  });
