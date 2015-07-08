'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:PhoneCtrl
 * @description
 * # PhoneCtrl
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('UIController', function ($scope, $location , $timeout, UiService, Auth, AuthToken , CallCenter , rtmp,
    AGENT_ANSWER_TIMEOUT) {
    $scope.userRTMPSession;
    $scope.current = UiService.currentTab;
    $scope.pageTitle = UiService.pageTitle;
    $scope.isAuthenticated = AuthToken.isAuthenticated;
    $scope.user = Auth.currentUser();

    $scope.isAuthenticatedAndFS = function () {
      $timeout(function(){
          return false;
      });
    };


    $scope.isCall = false;

    $scope.$on('rtmp:state:login', function (event, message) {
      $timeout(function() {
        if (message.status == "success") {
          $scope.userRTMPSession = message.session + "/" + message.user + "@" + message.domain;
          $scope.isAuthenticatedAndFS = function () {
            return AuthToken.isAuthenticated();
          };
          UiService.ok("connected successfully  to communication server");
        } else {
          UiService.error("agent credential do not match in communication server");
          $scope.isAuthenticatedAndFS = function () {
            return false;
          };
        }
      });
    });

    $scope.$on("rtmp:call", function (event, callInfo) {
      $timeout(function(){
        UiService.info("new call from " + callInfo.name ? callInfo.name : 'UnKnown', callInfo.number ? callInfo.number : 'UnKnown', 8000);
      });
    });

    $scope.$on('rtmp:call:hangup', function (event, message) {
      $timeout(function () {
        if(message.status == 'done'){
          UiService.info("call ended");
        } else {
          UiService.info("call added to be retried");
        }
        $scope.isCall = false;
        CallCenter.hangup({status : message.status});
        $location.path('/recent');
      });
    });

    $scope.$on('call:complete',function(event,msg){
      $timeout(function () {
        $location.path('/recent');
        $scope.isCall = false;
      });
    });

    $scope.$on('call:problem',function(event,msg){
      $timeout(function(){
        $location.path('/recent');
        $scope.isCall = false;
      });
    });

    $scope.$on("rtmp:state", function (event, state) {
      $timeout(function(){
        if (state.status != "connected") {
          $scope.isCall = false;
          $scope.isAuthenticatedAndFS = function () {
            return false;
          };
        }
      });
    });

    $scope.$on("rtmp:debug",function(event,message){
      console.log("rtmp debug : " + message.message);
    });

    $scope.$on("Auth:login",function(event,message){
      $scope.user = Auth.currentUser();
    });

    $scope.$on("Auth:logout",function(event,message){
      CallCenter.init();
    });

    $scope.closeAlert = function (index) {
      UiService.closeAlertIdx(index);
    };

    $scope.$on('alert:notify', function (event, alerts) {
      $timeout(function(){
        $scope.alerts = alerts;
      });
    });

  });
