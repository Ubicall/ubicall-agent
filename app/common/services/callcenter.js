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

    // generate dynamic topic layout for socket to subscribe
    var payload = AuthToken.payload();
    if (payload.per && payload.per.notify) {
      for (var prev in payload.per.notify) {
        if (prev == "system") {
          angular.forEach(payload.per.notify["system"], function (item) {
            comms.subscribe(item, function (topic, result) {
              // There is No System wide events yet
              alertService.add("info ", prev + " : " + topic + " : " + result.message);
            });
          });
        }
        if (prev == "api") {
          angular.forEach(payload.per.notify["api"], function (item) {
            var topicLayout = AuthToken.payload().lic + ":" + item
            comms.subscribe(topicLayout, function (topic, result) {
              if (item == "calls:updated") {
                Array.prototype.unshift.apply(calls, result.calls);
                $rootScope.$broadcast("calls:updated", calls);
              }
              if (item == "queues:updated") {
                Array.prototype.unshift.apply(queues, result.queues);
                $rootScope.$broadcast("queues:updated", queues);
              }
            });
          });
        }
        if (prev == "agent") {
          angular.forEach(payload.per.notify["agent"], function (item) {
            var topicLayout = AuthToken.payload().lic + ":" + item + ":" + AuthToken.payload().username;
            comms.subscribe(topicLayout, function (topic, result) {
              if (item == "call:ringing") {
                alertService.add("info", result.message);
              }
              if (item == "call:complete") {
                alertService.add("success", result.message);
              }
              if (item == "call:problem") {
                alertService.add("danger", result.message);
              }
            });
          });
        }
      }
    }
    return CallCenter;
  }
);
