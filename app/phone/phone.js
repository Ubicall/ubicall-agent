'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:PhoneCtrl
 * @description
 * # PhoneCtrl
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('PhoneController', function ($scope , $timeout, rtmp, $window, UiService , AGENT_ANSWER_TIMEOUT) {

    // ["signal-none" ,"signal-weak" ,"signal-medium"]

    $scope.signal = {class: 'signal-strong', title: 'signal strong'};
    $scope.fsFlashLoaded = rtmp.onFSLoaded;
    $scope.answered = false ;
    $scope.hanguped = false;

    $scope.$on("rtmp:call", function (event, callInfo) {
      $timeout(function(){
        console.log("in $scope.$on rtmp:call timout ");
        $scope.answered = false;
        $scope.isCall = true;
        $scope.hanguped = false;
        // //TODO : wait AGENT_ANSWER_TIMEOUT then call hangup , if agent answer then cancle this timeout
        $scope.whatIfAgnetNotAnswer = function(){
           console.log("agent not answered , so we hangup !");
           $scope.hangup();
        }
        $scope.agentAnswerTimeout = $timeout(function(){ $scope.whatIfAgnetNotAnswer(); }, AGENT_ANSWER_TIMEOUT * 1000);
      });
    });

    $scope.$on('rtmp:call:hangup', function (event, message) {
      $timeout(function () {
        $scope.isCall = false;
      });
    });

    $scope.$on('call:complete',function(event,msg){
      $timeout(function () {
        $scope.isCall = false;
      });
    });

    $scope.$on('call:problem',function(event,msg){
      $timeout(function(){
        $scope.isCall = false;
      });
    });

    $scope.$on("rtmp:state", function (event, state) {
      $timeout(function(){
        if (state.status != "connected") {
          $scope.isCall = false;
        }
      });
    });


    $scope.answer = function(){
      $timeout(function () {
        console.log("in $scope.answer ");
        $timeout.cancel($scope.agentAnswerTimeout);
        $scope.answered = true;
        $scope.isCall = true;
        $scope.hanguped = false;
        rtmp.answer();
      });
    }

    $scope.hangup = function(){
      rtmp.hangup();
      $timeout(function () {
        console.log("in $scope.hangup ");
        $scope.isCall = false;
        $scope.answered = false;
        $scope.hanguped = true;
      });
    };

  });
