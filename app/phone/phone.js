'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:PhoneCtrl
 * @description
 * # PhoneCtrl
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('PhoneController', function ($scope, rtmp, $window, UiService) {

    // ["signal-none" ,"signal-weak" ,"signal-medium"]
    $scope.id = "flash";

    $scope.signal = {class: 'signal-strong', title: 'signal strong'};
    $scope.fsFlashLoaded = rtmp.onFSLoaded;

    $scope.answer = rtmp.answer;
    $scope.hangup = rtmp.hangup;

    $scope.$on("rtmp:login", function (event, loginInfo) {
      if (loginInfo.status == "success") {


        // dim answer and hangup until call received
        // notify user he can ask for calls now

      } else {
        // should dim answer and hangup button
        // notify that there is no signal from communication server
      }
    });

    $scope.$on("rtmp:call", function (event, callInfo) {
      UiService.add("info", "new call from " + callInfo.name ? callInfo.name : 'UnKnown',
        callInfo.number ? callInfo.number : 'UnKnown');
      $window.alert("new call from UnKnown");

      // now show answer and hangup button
    });

  });
