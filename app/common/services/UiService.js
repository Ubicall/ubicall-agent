'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.alert
 * @description
 * # alert
 * Factory in the agentUiApp.
 */
angular.module('agentUiApp')
  .factory('UiService', function ($timeout, $rootScope) {
    var previousTab;
    var currentTab;
    var currentTitle;
    var alerts = [];

    function setCurrentTab(tab, pageTitle) {
      previousTab = currentTab;
      currentTab = tab;
      currentTitle = pageTitle;
    };

    function getCurrentTab() {
      return currentTab;
    }

    function getPageTitle() {
      return currentTitle;
    }

    function add(type, msg, timeout) {
      var that = this;
      $timeout(function () {
        closeAlert(that);
      }, timeout || 2000);
      alerts.push({
        type: type,
        msg: msg,
        closeable: true,
        close: function () {
          return closeAlert(that);
        }
      });
      $rootScope.$broadcast("alert:notify", alerts);
    }

    function closeAlert(alert) {
      var re = closeAlertIdx(alerts.indexOf(alert));
      $rootScope.$broadcast("alert:notify", alerts);
      return re;
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

    return {
      info: function (msg, timout) {
        add("info", msg, timout);
      },
      ok: function (msg, timout) {
        add("success", msg, timout);
      },
      error: function (msg, timout) {
        add("danger", msg, 8000);
      },
      warn: function (msg, timout) {
        add("warning", msg, timout);
      },
      closeAlert: closeAlert,
      closeAlertIdx: closeAlertIdx,
      clear: clear,
      get: get,
      setCurrentTab: setCurrentTab,
      currentTab: getCurrentTab,
      pageTitle: getPageTitle
    }
  });
