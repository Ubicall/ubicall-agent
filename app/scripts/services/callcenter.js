'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.CallCenter
 * @description
 * # CallCenter
 * Service in the agentUiApp.
 */
angular.module('agentUiApp')
  .service('CallCenter', function ($http, $rootScope, $log, $q, localStorageService,
                                   alertService, AuthToken, API_BASE, comms) {
    var CallCenter = {};
//TODO :Use https://github.com/jmdobry/angular-cache instead
    var calls, queues;

    function _getCalls() {
      var deferred = $q.defer();
      if (calls) {
        deferred.resolve(calls);
      } else {
        $http.get(API_BASE + "/calls").then(function (result) {
          calls = result.data;
          deferred.resolve(result.data);
        }, function (error) {
          deferred.reject(error);
        });
      }
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
      } else {
        $http.get(API_BASE + "/queues").then(function (result) {
          queues = result.data;
          deferred.resolve(result.data);
        }, function (error) {
          deferred.reject(error);
        });
      }
      return deferred.promise;
    };

    CallCenter.getMeCall = function (qid, qslug) {
      var deferred = $q.defer();
      $http.get(API_BASE + "/call/" + qid + "/" + qslug)
        .then(function success(res) {
          // return your call client detail
          // wait your phone ring
          // answer
          // wait to your client to get connected
          return deferred.resolve(res.data);
        }, function error(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };

    comms.subscribe("calls:updated", function (topic, call) {
      calls.unshift(call);
      $rootScope.$broadcast("calls:updated", calls);

    });

    comms.subscribe("queues:updated", function (topic, queue) {
      queues.unshift(queue);
      $rootScope.$broadcast("queues:updated", queues);

    });

    comms.subscribe(["call:ringing", "call:complete", "call:problem"],
      function (topic, callStatus) {
        if (topic == "call:problem") {
          alertService.add("alert", callStatus.message);
        } else if (topic == "call:ringing") {
          alertService.add("info", callStatus.message);
        } else if (topic == "call:complete") {
          alertService.add("success", callStatus.message);
        }
      });

    return CallCenter;
  });
