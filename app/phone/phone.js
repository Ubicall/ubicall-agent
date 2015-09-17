'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:PhoneCtrl
 * @description
 * # PhoneCtrl
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('PhoneController', function ($rootScope ,$scope , $timeout, $window , $log, rtmp , UiService , AGENT_ANSWER_TIMEOUT) {

    $scope.answered = false ;
    $scope.clientAnswered = false ;
    $scope.hanguped = false;


    $scope.$on("rtmp:call", function (event, callInfo) {
      $timeout(function(){
        $scope.answered = false;
        $scope.clientAnswered = false ;
        $scope.isCall = true;
        $scope.hanguped = false;
        // wait AGENT_ANSWER_TIMEOUT then call hangup , if agent answer then cancle this timeout
        $scope.whatIfAgnetNotAnswer = function(){
           UiService.grimace("Not answered the call, so we hangup !",{duration : 8000 , sticky : true});
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

    $rootScope.$on('rtmp:call:client:answer', function (event, message) {
      $timeout(function () {
        UiService.info("Client answered your call....");
        // showing and starting the timer
        $scope.clientAnswered = true ;
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
        UiService.error("Problem occurred while receiving call....");
      });
    });

    $scope.$on("rtmp:state", function (event, state) {
      $timeout(function(){
        if (state.status == "disconnected" || state.status == 'connecting') {
          $scope.isCall = false;

        }else if (state.status == "connected") {

        }
      });
    });


    $scope.answer = function(){
      $timeout(function () {
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
        $timeout.cancel($scope.agentAnswerTimeout);
        $scope.isCall = false;
        $scope.answered = false;
        $scope.clientAnswered = false ;
        $scope.hanguped = true;
      });
    };

  });
