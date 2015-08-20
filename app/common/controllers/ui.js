'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:PhoneCtrl
 * @description
 * # PhoneCtrl
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('UIController', function ($scope, $location , $timeout , $log , UiService, Auth, AuthToken , CallCenter , rtmp,
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

    $scope.showQueues = function(){ //show queues only in recent , queue , call pages
      var re = /^\/recent|\/queue|\/call|\/reports|\/me/;
      return re.test($location.path());
    }

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
        UiService.info('you got a new call ....');
      });
    });

    $scope.$on('rtmp:call:hangup', function (event, message) {
      $timeout(function () {
        if(message.uuid && (message.status == 'done' || message.status == 'retry')){
          CallCenter.hangup({status : message.status ,
            error : message.error , duration : message.duration});
        }
        $location.path('/recent');
      });
    });

    $scope.$on('call:complete',function(event,msg){
      $timeout(function () {
        $location.path('/recent');
      });
    });

    $scope.$on('call:problem',function(event,msg){
      $timeout(function(){
        $location.path('/recent');
      });
    });

    $scope.$on('rtmp:problem',function(event,msg){
      $timeout(function () {
        UiService.error(msg.message);
      });
    });

    $scope.$on("rtmp:state", function (event, state) {
      $timeout(function(){
        if(state.status == 'connected'){
          UiService.ok("successfully connected to communication server");
        } else {
          $scope.isAuthenticatedAndFS = function () {
            return false;
          };
          UiService.info("take a rest , we try to connect you back to server , you will not able to send or recieve calls");
        }
      });
    });

    $scope.$on("rtmp:debug",function(event,message){
      $log.debug("rtmp debug : " + message.message);
    });

    $scope.$on("Auth:login",function(event,message){
      $scope.user = Auth.currentUser();
      $location.path('/recent');
    });

    $scope.$on("Auth:logout",function(event,message){
      CallCenter.init();
      $location.path('/login');
    });

  });
