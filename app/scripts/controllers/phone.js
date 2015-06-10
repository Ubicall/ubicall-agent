'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:PhoneCtrl
 * @description
 * # PhoneCtrl
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('PhoneController', function ($scope, $window, FS_RTMP, alertService) {
    var fsrtmp;
    var mics;
    var currentMic;
    var calls = [];

    $scope.status = "Waiting for communication server";
    $scope.sessionid;

    $scope.flashvars = {
      rtmp_url: FS_RTMP
    };

    $scope.params = {
      allowScriptAccess: 'always'
    };

    $scope.onLoadHandler = function (evt) {
      if (evt.success) {
        fsrtmp = angular.element(document.querySelector("#" + evt.id))[0];

        $window.onConnected = function (sessionid) {
          $scope.sessionid = sessionid;
          $scope.status = "Connected";
          alertService.add("success", "rtmp session is " + sessionid);
          $window.fsLogin("1112@104.239.164.247", "26021234");
        };


        $window.onDisconnected = function () {
          $scope.status = "Disconnected";
          $scope.sessionid = "";
          setTimeout(function () {
            $scope.status = "Connecting...";
            fsrtmp.connect();
          }, 5000);
        };


        $window.onLogin = function (status, user, domain) {
          if (status != "success") {
            alertService.add("danger", "Authentication failed! onAuth");
          } else {
            alertService.add("success", "connected to the matrix");
            var u = user + '@' + domain;
            fsrtmp.register(u, "");
            // you logged in now with your sip credentials
          }
        };

        $window.fsLogin = function (user, pass) {
          fsrtmp.login(user, pass);
        };

        $window.fsLogout = function (account) {
          fsrtmp.logout(account);
        };

        $window.fsHangup = function (uuid) {
          fsrtmp.hangup(uuid);
        };

        $window.answer = function (uuid) {
          fsrtmp.answer(uuid);
        };

        $scope.hangup = function () {
          $window.fsHangup($scope.callUuid);
          $scope.callIn = false;
          $scope.callName = $scope.callNumber = $scope.callUuid = $scope.callAccount = '';
          $scope.phone = "noCall";
        };

        $scope.answer = function () {
          $window.fsHangup($scope.callUuid);
          $scope.phone = "answer";
        };

        $window.onIncomingCall = function (uuid, name, number, account, evt) {
          calls.push({uuid: uuid, name: name, number: number});
          $scope.callName = name;
          $scope.callNumber = number;
          $scope.callUuid = uuid;
          $scope.callAccount = account;
          $scope.phone = "ringing";
          $scope.callIn = true;

          console.log(name + " " + number + " calling with uuid " + uuid);
          $window.answer(uuid);
        };

        $window.onDebug = function (message) {
          alertService.add("info", message);
        }

      }
    };


  });
