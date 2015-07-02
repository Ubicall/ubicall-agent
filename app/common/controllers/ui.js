'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:PhoneCtrl
 * @description
 * # PhoneCtrl
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('UIController', function ($scope, $location, UiService, Auth, AuthToken , CallCenter) {
    $scope.userRTMPSession;
    $scope.current = UiService.currentTab;
    $scope.pageTitle = UiService.pageTitle;
    $scope.isAuthenticated = AuthToken.isAuthenticated;
    $scope.user = Auth.currentUser();

    $scope.isAuthenticatedAndFS = function () {
      return false;
    };


    $scope.isCall = false;

    $scope.$on('rtmp:state:login', function (event, message) {
      if (message.status == "success") {
        $scope.userRTMPSession = message.session + "/" + message.user + "@" + message.domain;
        $scope.isAuthenticatedAndFS = function () {
          return AuthToken.isAuthenticated();
        };
        UiService.ok("connected successfully  to communication server");
        if (!$scope.$$phase) {
          $scope.$apply();
        }
      } else {
        UiService.error("agent credential do not match in communication server");
        $scope.isAuthenticatedAndFS = function () {
          return false;
        };
        if (!$scope.$$phase) {
          $scope.$apply();
        }
      }
    });

    $scope.$on('rtmp:call', function (event, callInfo) {
      console.log('ui controller rtmp call');
      $scope.isCall = true;
      UiService.info("new call from " + callInfo.name ? callInfo.name : 'UnKnown',
        callInfo.number ? callInfo.number : 'UnKnown', 8000);
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    });

    $scope.$on('rtmp:call:hangup', function (event, message) {
      UiService.info("call ended");
      $scope.isCall = false;
      CallCenter.hangup();
      $location.path('/recent');
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    });

    $scope.$on("rtmp:state", function (event, state) {
      if (state.status != "connected") {
        $scope.isCall = false;
        $scope.isAuthenticatedAndFS = function () {
          return false;
        };
        if (!$scope.$$phase) {
          $scope.$apply();
        }
      }
    });

    $scope.closeAlert = function (index) {
      UiService.closeAlertIdx(index);
    };

    $scope.$on('alert:notify', function (event, alerts) {
      $scope.alerts = alerts;
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    });

  });
