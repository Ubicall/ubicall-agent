'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.alert
 * @description
 * # alert
 * Factory in the agentUiApp.
 */
angular.module('agentUiApp')
  .factory('alertService', function ($timeout, $rootScope) {
    var service = {
        add: add,
        closeAlert: closeAlert,
        closeAlertIdx: closeAlertIdx,
        clear: clear,
        get: get
      },
      alerts = [];

    return service;

    function add(type, msg, tout) {
      var that = this;
      tout = tout || 6000; //6 seconds
      type = type || 'success';
      $timeout(function () {
        closeAlert(that);
      }, tout);
      alerts.push({
        type: type,
        msg: msg,
        closeable: true,
        close: function () {
          return closeAlert(that);
        }
      });
      $rootScope.$broadcast("notify", alerts);
    }

    function closeAlert(alert) {
      return closeAlertIdx(alerts.indexOf(alert));
    }

    function closeAlertIdx(index) {
      return alerts.splice(index, 1);
    }

    function clear() {
      alerts = [];
    }

    function get() {
      return alerts;
    }
  });
