'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:PhoneCtrl
 * @description
 * # PhoneCtrl
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('UIController', function ($scope, $location , $timeout , $log , UiService, Auth, AuthToken , CallCenter , rtmp, _swfobject,
    FLASH_OBJ_VARS ,FLASH_PHONE_ID ,FLASH_OBJ_PARAMS ,FLASH_EXPRESS_INSTALL ,AGENT_ANSWER_TIMEOUT) {
    $scope.userRTMPSession;
    $scope.current = UiService.currentTab;
    $scope.pageTitle = UiService.pageTitle;
    $scope.isAuthenticated = AuthToken.isAuthenticated;
    $scope.user = Auth.currentUser();

    // dim screen to disconnection issues
    $scope.dimScreen = false;

    $scope.fsFlashLoaded = rtmp.onFSLoaded;
    $scope.rtmpConfig = FLASH_OBJ_VARS;
    $scope.flashPhoneId = FLASH_PHONE_ID;
    $scope.swfObjParams = FLASH_OBJ_PARAMS;
    $scope.swfExpressInstall= FLASH_EXPRESS_INSTALL;

    $scope.isAuthenticatedAndFS = function () {
      $timeout(function(){
          return false;
      });
    };

    $scope.showQueues = function(){ //show queues only in recent , queue , call pages
      var re = /^\/recent|\/queue|\/call|\/reports|\/me/;
      return re.test($location.path());
    }

    // hide header and pages-title in login and forget password pages
    $scope.hideHeader = function(){
      var re = /\/login|\/forget_password|\/logout/;
      return re.test($location.path());
    }

    // resize Main View from col-md-9 ubi-md-9 ==> col-md-12 if hideHeader or in main or profile page
    // make col-md-3 ubi-md-3 ==> col-md-3 ubi-md-3 hide
    $scope.resizeMainView = function(){
      var re = /\/main|\/me/;
      return $scope.hideHeader() || re.test($location.path());
    }

    // global event to watch if client disconnected to backend;
    $scope.$on('system:error:disconnected', function (event, cause) {
      $timeout(function() {
        $scope.dimScreen = true;
        $log.info(cause.message);
      });
    });

    // global event to watch if client connected to backend;
    $scope.$on('system:connected', function (event, cause) {
      $timeout(function() {
        $scope.dimScreen = false;
        $log.info(cause.message);
      });
    });

    // flash is disabled (should check webRTC ) dem screen
    $scope.$on('system:error:flash', function (event, cause) {
      $timeout(function() {
        $scope.dimScreen = true;
        $log.info(cause.message);
        UiService.error(cause.message);
      });
    });

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
          // UiService.ok("successfully connected to communication server");
          $log.info('successfully connected to communication server');
        } else {
          $scope.isAuthenticatedAndFS = function () {
            return false;
          };
          $log.info('take a rest , we try to connect you back to server , you will not able to send or recieve calls');
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
