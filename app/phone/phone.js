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

    $scope.signal = {class: 'signal-strong', title: 'signal strong'};
    $scope.fsFlashLoaded = rtmp.onFSLoaded;
    $scope.answered = false ;

    $scope.answer = function(){
      $scope.answered = true;
      rtmp.answer();
    }
    $scope.hangup = rtmp.hangup;

  });
