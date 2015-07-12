'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:PhoneCtrl
 * @description
 * # PhoneCtrl
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('PhoneController', function ($scope , $timeout, $window , $log,
    rtmp ,FLASH_OBJ_VARS ,FLASH_PHONE_ID ,FLASH_OBJ_PARAMS , AGENT_ANSWER_TIMEOUT) {

    // ["signal-none" ,"signal-weak" ,"signal-medium"]

    $scope.signal = {class: 'signal-strong', title: 'strong signal'};
    $scope.fsFlashLoaded = rtmp.onFSLoaded;
    $scope.answered = false ;
    $scope.hanguped = false;
    $scope.rtmpConfig = FLASH_OBJ_VARS;
    $scope.flashPhoneId = FLASH_PHONE_ID;
    $scope.swfObjParams = FLASH_OBJ_PARAMS;


    $scope.$on("rtmp:call", function (event, callInfo) {
      $timeout(function(){
        $scope.answered = false;
        $scope.isCall = true;
        $scope.hanguped = false;
        // wait AGENT_ANSWER_TIMEOUT then call hangup , if agent answer then cancle this timeout
        $scope.whatIfAgnetNotAnswer = function(){
           $log.info("agent not answered , so we hangup !");
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
        if (state.status == "disconnected" || state.status == 'connecting') {
          $scope.isCall = false;
          $scope.signal = {class: 'signal-none', title: 'no signal'};
        }else if (state.status == "connected") {
          $scope.signal = {class: 'signal-strong', title: 'strong signal'};
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
        $scope.isCall = false;
        $scope.answered = false;
        $scope.hanguped = true;
      });
    };

  });
