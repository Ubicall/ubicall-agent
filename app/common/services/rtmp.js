'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.rtmp
 * @description
 * # rtmp
 * Service in the agentUiApp.
 */
angular.module('agentUiApp')
  .service('rtmp', function ($rootScope, $window, AuthToken, FS_RTMP, $timeout) {
    var fsrtmp;
    var currentCall;
    var allCalls = [];
    var rtmpSession;
    //[connected , disconnected , connecting]
    var rtmpSessionStatus;
    var sessionUser;


    var payload

    function fsLogin() {
      payload = AuthToken.payload();
      if (payload && payload.sip && payload.sip.num && payload.sip.cred) {
        fsrtmp.login(payload.sip.num, payload.sip.cred);
      } else {
        $rootScope.$broadcast("rtmp:problem", {message: "un able to login , no credentials", level: 3});
      }
    }

    function fsLogout() {
      fsrtmp.logout(sessionUser);
    }

    function fsAnswer() {
      if (currentCall) {
        fsrtmp.answer(currentCall.uuid);
      }
    }

    function fsHangup() {
      if (currentCall) {
        fsrtmp.hangup(currentCall.uuid);
      }
    }

    function fsRegister() {
      fsrtmp.register(sessionUser, "");
    }

    function fsConnect() {
      fsrtmp.connect();
    }

    $window.onConnected = function (sessionid) {
      rtmpSession = sessionid;
      rtmpSessionStatus = "connected";
      $rootScope.$broadcast("rtmp:state", {session: rtmpSession, status: rtmpSessionStatus, level: 3});
      console.log("rtmp:state", {session: rtmpSession, status: rtmpSessionStatus, level: 3});
    };


    $window.onDisconnected = function () {
      rtmpSessionStatus = "disconnected";
      $rootScope.$broadcast("rtmp:state", {session: rtmpSession, status: rtmpSessionStatus, level: 1});
      console.log("rtmp:state", {session: rtmpSession, status: rtmpSessionStatus, level: 1});
      $timeout(function () {
        rtmpSessionStatus = "connecting";
        $rootScope.$broadcast("rtmp:state", {session: rtmpSession, status: rtmpSessionStatus, level: 3});
        console.log("rtmp:state", {session: rtmpSession, status: rtmpSessionStatus, level: 3});
        fsConnect();
      }, 5000);
    };


    $window.onLogin = function (status, user, domain) {
      $rootScope.$broadcast("rtmp:login", {
        session: rtmpSession, status: status,
        user: user, domain: domain
      });
      console.log("rtmp:login", {
        session: rtmpSession, status: status,
        user: user, domain: domain
      });
      if (status == "success") {
        sessionUser = user + '@' + domain;
        fsRegister();
        // what to broadcast here ?
      }
    };

    $window.onIncomingCall = function (uuid, name, number, account, evt) {
      currentCall = {uuid: uuid, name: name, number: number, account: account};
      allCalls.push(currentCall);
      $rootScope.$broadcast("rtmp:call", {uuid: uuid, name: name, number: number, account: account, level: 3});
      console.log("rtmp:call", {uuid: uuid, name: name, number: number, account: account, level: 3});
      console.log("current call info " + JSON.stringify(currentCall));

      fsAnswer();
    };

    $window.onDebug = function (message) {
      $rootScope.$broadcast("rtmp:debug", {message: message, level: 5});
      console.log("rtmp:debug", {message: message, level: 5});
    };

    $window.fsFlashLoaded = function (evt) {
      if (evt.success) {

        fsrtmp = angular.element(document.querySelector("#" + evt.id))[0];


      }
      else {
        $rootScope.$broadcast("rtmp:problem", {message: "flash fail in loading", level: 1});
        console.log("rtmp:problem", {message: "flash fail in loading", level: 1});
      }
    };

    return {
      rtmpVars: {rtmp_url: FS_RTMP},
      rtmpParams: {allowScriptAccess: 'always'},
      onFSLoaded: $window.fsFlashLoaded,
      login: fsLogin,
      logout: fsLogout,
      answer: fsAnswer,
      hangup: fsHangup,
      me: function () {
        if(!sessionUser){
          sessionUser=AuthToken.payload().sip.num;
        }
        return rtmpSession + "/" + sessionUser
      }
    }
  }
);
