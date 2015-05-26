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
    var calls;
    this.getAvailablesCalls = function () {
      var deferred = $q.defer();
      $http.get(API_BASE + "/calls").then(function (result) {
        deferred.resolve(result.data);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    this.getCallDetail = function (queueid, callid) {
      var deferred = $q.defer();
      $http.get(API_BASE + "/call/" + queueid + "/" + callid).then(function (result) {
        deferred.resolve(result.data);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    this.getQueues = function () {
      var deferred = $q.defer();
      $http.get(API_BASE + "/queues").then(function (result) {
        deferred.resolve(result.data);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
  });
