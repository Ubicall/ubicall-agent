'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:ReportsController
 * @description
 * # ReportsController
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('ReportsController', function ($scope, $location, $log, Auth ,helpers, CallCenter, UiService, moment, amMoment) {
    UiService.setCurrentTab('reports', 'Reports');
    if (!Auth.currentUser()) {
      Auth.logout();
    } else {

    }
  });
