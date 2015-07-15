'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:RecentController
 * @description
 * # RecentController
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('RecentController', function ($scope, $location, $log, Auth ,helpers, CallCenter, UiService, moment, amMoment) {
    UiService.setCurrentTab('recent', 'Recent Calls');
    if (!Auth.currentUser()) {
      Auth.logout();
    } else {
      var _user = Auth.currentUser().user;
      var _calls, _totalCalls;

      $scope.callsCurrentPage = 1;
      $scope.callsPageSize = 10;

      $scope.user = _user;

      $scope.calls = _calls = [];
      $scope.totalCalls = _totalCalls = 0;

      CallCenter.getAvailableCalls().then(function (calls) {
        _totalCalls = calls.length;
        $scope.totalCalls = _totalCalls;
        _calls = calls;
        $scope.calls = _calls;
      });

      $scope.diffDates = helpers.diffDates ;

      $scope.$on('calls:updated', function (event, calls) {
        $scope.totalCalls = _totalCalls = calls.length;
        $scope.calls = _calls = calls;
      });

      $scope.$on("rtmp:login", function (event, loginInfo) {
        $log.debug("loginInfo is " + loginInfo);
      });
    }
  });
