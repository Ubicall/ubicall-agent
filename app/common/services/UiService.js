'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.alert
 * @description
 * # alert
 * Factory in the agentUiApp.
 */
angular.module('agentUiApp')
  .factory('UiService', function ($timeout, $rootScope , $notification , ngNotify) {
    var previousTab;
    var currentTab;
    var currentTitle;

    // used for any notifications but call
    ngNotify.config({
      theme: 'pure',
      position: 'bottom',
      duration: '2000',
      type: 'info',
      sticky: false,
      html: true
    });

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
      ring: function (msg) {
        $notification("Incoming Call", {
            body: msg,
            dir: 'auto',
            lang: 'en',
            tag: 'coming-call',
            icon: 'https://cdn.ubicall.com/static/ubicall/images/incoming-call.png',
            focusWindowOnClick: true // focus the window on click
        });
        ngNotify.set(msg, {type: 'info' , duration: '8000'});
      },
      ok: function (msg) {
        ngNotify.set(msg, {type: 'success'});
      },
      info: function (msg) {
        ngNotify.set(msg, {type: 'info'});
      },
      warn: function (msg, timout) {
        ngNotify.set(msg, {type: 'warn'});
      },
      error: function (msg) {
        ngNotify.set(msg, {type: 'error' , sticky: true});
      },
      setCurrentTab: setCurrentTab,
      currentTab: getCurrentTab,
      pageTitle: getPageTitle
    }
  });
