'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.rtmp
 * @description
 * # UiService
 * Service in the agentUiApp.
 */
angular.module('agentUiApp')
  .service('UiService', function ($rootScope, $window, AuthToken, $timeout) {
    var previousTab;
    var currentTab;
    var currentTitle;
    var setCurrentTab = function (tab, pageTitle) {
      previousTab = currentTab;
      currentTab = tab;
      currentTitle = pageTitle;
    };

    return {
      currentTab: function () {
        return currentTab;
      },
      pageTitle: function () {
        return currentTitle
      }
    }
  }
);
