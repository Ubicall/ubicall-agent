'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:PhoneCtrl
 * @description
 * # PhoneCtrl
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('UIController', function ($scope, UiService, AuthToken) {
    $scope.userRTMPSession;
    $scope.current = UiService.currentTab;
    $scope.pageTitle = UiService.pageTitle;
    $scope.isAuthenticated = AuthToken.isAuthenticated;
    $scope.isAuthenticatedAndFS = function () {
      return false;
    };


    $scope.isCall = false;

    $scope.$on('rtmp:state:login', function (event, message) {
      if (message.status == "success") {
        $scope.userRTMPSession = message.session + "/" + message.user + "@" + message.domain;
        console.log('agent connected to fs as' + $scope.userRTMPSession);
        $scope.isAuthenticatedAndFS = function () {
          return AuthToken.isAuthenticated();
        };
        console.log("$scope.isAuthenticated() is " + $scope.isAuthenticated());
      } else {
        console.log('agent credential is not correct with FS');
        $scope.isAuthenticatedAndFS = function () {
          return false;
        };
      }
    });

    $scope.$on('rtmp:call', function (event, callInfo) {
      console.log('ui controller rtmp call');
      $scope.isCall = true;
      UiService.add("info", "new call from " + callInfo.name ? callInfo.name : 'UnKnown',
        callInfo.number ? callInfo.number : 'UnKnown');
    });

    $scope.$on('rtmp:call:hangup', function (event, message) {
      console.log('ui controller rtmp call');
      $scope.isCall = false;
    });
  });
