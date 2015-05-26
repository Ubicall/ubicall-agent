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
      var call = [];
      angular.forEach(calls, function (item) {
        if (item.callid === callid && item.queueid === queueid) {
          this.push(item);
        }
      }, call);

      call = {
        name: 'waleed', image: "images/home-pic-04.jpg",
        pigImage: "images/home-pic-01.jpg", title: 'man we', fullName: 'waleed samy',
        phone: '+201069527634', date: '2/1/2013', time: '7:38:05 AM'
      };
      return call;
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
