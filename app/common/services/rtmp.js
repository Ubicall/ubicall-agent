'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.rtmp
 * @description
 * # rtmp
 * Service in the agentUiApp.
 */
angular.module('agentUiApp')
  .service('rtmp', function ($rootScope, $window, $log ,$timeout , AuthToken  , moment ,
    _ , MAKE_CALL_DONE , AGENT_ANSWER_TIMEOUT ,FLASH_PHONE_ID) {
    var fsrtmp;
    var currentCall = {};
    var allCalls = [];
    var rtmpSession;
    //[connected , disconnected , connecting]
    var rtmpSessionStatus;
    var sessionUser;

    var payload;

    function fsLogin() {
      payload = AuthToken.payload();
      if (!fsrtmp) {
        fsrtmp = angular.element(document.querySelector("#"+FLASH_PHONE_ID))[0];
        $log.debug("hack to get fsrtmp and it is" + fsrtmp);
      }
      if (fsrtmp && payload && payload.sip && payload.sip.num && payload.sip.cred) {
        $log.info("try to authenticate with communication server using credentials " + payload.sip.num +"/"+ payload.sip.cred )
        fsrtmp.login(payload.sip.num, payload.sip.cred);
      } else {
        $rootScope.$broadcast("rtmp:problem", {
          message: "unable to login , no credentials or flash not loaded",
          level: 3
        });
      }
    }

    function fsLogout() {
      if (fsrtmp) {
        fsrtmp.logout(sessionUser);
      }
    }

    function fsAnswer() {
      if (currentCall && fsrtmp) {
        fsrtmp.answer(currentCall.uuid);
      }
    }

    function fsHangup() {
      if (currentCall && currentCall.uuid) {
        fsrtmp.hangup(currentCall.uuid);
      }
      checkCallStatus();
    }

    function fsRegister() {
      if (fsrtmp) {
        fsrtmp.register(sessionUser, "");
      }
    }

    function fsConnect() {
      if (fsrtmp) {
        fsrtmp.connect();
      }
    }

    // this method called after agent hangup call or
    // client hangup call ' detected by "Closing media streams" message in onDebug'
    function checkCallStatus(){
      var now = moment();
      var startMoment = currentCall.start || now ;
      var endMoment = currentCall.end || now ;
      var callDuration = currentCall.duration =  endMoment.diff(startMoment,'seconds');

      // mark this call processed if
      //  call stay more than MAKE_CALL_DONE
      if(callDuration > MAKE_CALL_DONE){
        $log.info('call done');
        $rootScope.$broadcast("rtmp:call:hangup",
          {session: rtmpSession, uuid: currentCall.uuid , status :'done' , duration : callDuration});
      } else {
        $log.info('call retry , short call with duration less than ' + MAKE_CALL_DONE);
        $rootScope.$broadcast("rtmp:call:hangup",
          {session: rtmpSession, uuid: currentCall.uuid , status :'retry' ,
          duration : callDuration , error : 'call is short than ' + MAKE_CALL_DONE + ' seconds'});
      }
      currentCall = {};

    }

    $window.onConnected = function (sessionid) {
      $log.info("rtmp connect with sessionid " + sessionid);
      rtmpSession = sessionid;
      rtmpSessionStatus = "connected";
      if (!fsrtmp) {
        fsrtmp = angular.element(document.querySelector("#"+FLASH_PHONE_ID))[0];
        $log.debug("hack to get fsrtmp and it is" + fsrtmp);
      }
      $rootScope.$broadcast("rtmp:state", {session: rtmpSession, status: rtmpSessionStatus, level: 3});
      $window.fsFlashRequiredPermission();
      if (AuthToken.isAuthenticated()) {
        fsLogin();
      }else {
        $log.error("will not log in comm server beacuse your are not logged in yet");
        // TODO should logout now !
      }
    };

    $window.onDisconnected = function () {
      rtmpSessionStatus = "disconnected";
      $rootScope.$broadcast("rtmp:state", {session: rtmpSession, status: rtmpSessionStatus, level: 1});
      //TODO : what happen to current call when agent disconnected , what strategy to fall over ?
      $timeout(function () {
        rtmpSessionStatus = "connecting";
        $rootScope.$broadcast("rtmp:state", {session: rtmpSession, status: rtmpSessionStatus, level: 3});
        fsConnect();
      }, 5000);
    };


    $window.onLogin = function (status, user, domain) {
      if (status == "success") {
        $rootScope.$broadcast("rtmp:state:login", {
          session: rtmpSession, status: status,
          user: user, domain: domain
        });
        sessionUser = user + '@' + domain;
        fsRegister();
        // what to broadcast here ?
      }else {
        $log.error("unable to authenticate with communication server");
        // TODO should logout now !
      }
    };

    $window.onIncomingCall = function (uuid, name, number, account, evt) {
      $rootScope.$broadcast("rtmp:call", {uuid: uuid, name: name, number: number, account: account, level: 3});
      currentCall = {};
      currentCall.uuid = uuid;
      currentCall.name = name;
      currentCall.number = number;
      currentCall.account = account;
      currentCall.log = [];
      currentCall.start = currentCall.end = currentCall.duration = null;
      currentCall.started = false;
      allCalls.push(currentCall);
    };

    $window.onDebug = function (message) {
      $rootScope.$broadcast("rtmp:debug", {message: message, level: 5});
      currentCall.log.push(message);
      if( message == 'netStatus: NetStream.Buffer.Full' && !currentCall.started ){
        currentCall.start = moment();
        currentCall.started = true;
        $rootScope.$broadcast('rtmp:call:client:answer', currentCall);
      }else if (message == "Closing media streams") {
        currentCall.end = moment();
        checkCallStatus();
      }
    };

    var fsFlashLoaded = function (evt) {
      $log.debug("fsFlashLoaded");
      if (evt.success) {
        fsrtmp = angular.element(document.querySelector("#" + evt.id))[0];
        $log.debug("fsrtmp after flash loaded is " + fsrtmp);
      } else {
        $window.onConnected = null;
        $window.onDisconnected = null;
        $rootScope.$broadcast("system:error:flash",{message : "flash may be disable , please enable it and reload the page."});
      }
    };

    $window.fsFlashRequiredPermission = function(){
      $log.debug("fsFlashRequiredPermession");
      if( !fsrtmp ){
        $log.error("why fsrtmp is null");
        fsrtmp = angular.element(document.querySelector("#"+FLASH_PHONE_ID))[0];
      }
      if(fsrtmp && fsrtmp.isMuted()){
        $log.debug("fsrtmp.isMuted()" + fsrtmp.isMuted());
        $('#flashModal').modal('show');
      }
    };

    return {
      onFSLoaded: fsFlashLoaded,
      logout: fsLogout,
      answer: fsAnswer,
      hangup: fsHangup,
      me: function () {
        if (!sessionUser) {
          sessionUser = AuthToken.payload().sip.num;
        }
        return rtmpSession + "/" + sessionUser
      }
    }
  }
)
;
