'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.rtmp
 * @description
 * # rtmp
 * Service in the agentUiApp.
 */
angular.module('agentUiApp')
  .service('rtmp', function ($rootScope, $window, AuthToken, FS_RTMP, $timeout, UiService) {
    var fsrtmp;
    var currentCall;
    var allCalls = [];
    var rtmpSession;
    //[connected , disconnected , connecting]
    var rtmpSessionStatus;
    var sessionUser;

    var payload;

    function fsLogin() {
      payload = AuthToken.payload();
      if (fsrtmp && payload && payload.sip && payload.sip.num && payload.sip.cred) {
        fsrtmp.login(payload.sip.num, payload.sip.cred);
      } else {
        $rootScope.$broadcast("rtmp:problem", {
          message: "un able to login , no credentials or flash not loaded",
          level: 3
        });
        UiService.error("un able to login , no credentials or flash not loaded");
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
        UiService.info({session: rtmpSession, uuid: currentCall.uuid});
        $rootScope.$broadcast("rtmp:call:hangup", {session: rtmpSession, uuid: currentCall.uuid});
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
      UiService.info("successfully connected to communication server");
    };


    $window.onDisconnected = function () {
      rtmpSessionStatus = "disconnected";
      $rootScope.$broadcast("rtmp:state", {session: rtmpSession, status: rtmpSessionStatus, level: 1});
      UiService.info("take a rest , we try to connect you back to server");
      $timeout(function () {
        rtmpSessionStatus = "connecting";
        $rootScope.$broadcast("rtmp:state", {session: rtmpSession, status: rtmpSessionStatus, level: 3});
        UiService.info("try to connect you back to serve");
        fsConnect();
      }, 5000);
    };


    $window.onLogin = function (status, user, domain) {
      $rootScope.$broadcast("rtmp:state:login", {
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
      UiService.info("call " + uuid + " from " + name || " Unknown");
    };

    $window.onDebug = function (message) {
      $rootScope.$broadcast("rtmp:debug", {message: message, level: 5});
      UiService.info(message);
    };

    $window.fsFlashLoaded = function (evt) {
      if (evt.success) {
        fsrtmp = angular.element(document.querySelector("#" + evt.id))[0];
        if (!fsrtmp) {
          $rootScope.$broadcast("rtmp:problem", {message: "flash fail in loading", level: 1});
          UiService.error("flash fail in loading , please reload page");
        }
        if (AuthToken.isAuthenticated()) {
          fsLogin();
        }
      }
      else {
        $rootScope.$broadcast("rtmp:problem", {message: "flash fail in loading", level: 1});
        UiService.error({message: "flash fail in loading , please reload page", level: 1});
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
        if (!sessionUser) {
          sessionUser = AuthToken.payload().sip.num;
        }
        return rtmpSession + "/" + sessionUser
      }
    }
  }
);
