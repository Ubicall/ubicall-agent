'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.alert
 * @description
 * # alert
 * Factory in the agentUiApp.
 */
angular.module('agentUiApp')
  .factory('UiService', function ($timeout, $rootScope , $notification) {
    var previousTab;
    var currentTab;
    var currentTitle;

    // will fall back to old notifications if browser not support html5 notification api
    $notification.enableHtml5Mode()

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

    return {
      info: function (msg, timout) {
        $notification.info('Info', msg, timout);
      },
      ok: function (msg, timout) {
        $notification.success('Done', msg, timout);
      },
      error: function (msg, timout) {
        $notification.error('Error', msg, timout);
      },
      warn: function (msg, timout) {
        $notification.warning('Warning', msg, timout);
      },
      setCurrentTab: setCurrentTab,
      currentTab: getCurrentTab,
      pageTitle: getPageTitle
    }
  });
