'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:PhoneCtrl
 * @description
 * # PhoneCtrl
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('PhoneController', function ($scope, FS_RTMP, alertService) {
    var fsrtmp;
    var mics;
    var currentMic;
    var status = "Waiting for communication server"

    $scope.flashvars = {
      rtmp_url: FS_RTMP
    };

    $scope.params = {
      allowScriptAccess: 'always'
    };

    $scope.onLoadHandler = function (evt) {
      if (evt.success) {
        mics = fsrtmp.micList();
        currentMic = fsrtmp.getMic();
        fsrtmp = angular.element(document.querySelector("#" + evt.id))[0];
        fsrtmp.login("1100@104.239.164.247", "26021234");
      }
    };

    $scope.onLogin = function (status, user, domain) {
      if (status != "success") {
        alertService.add("danger", "Authentication failed! onAuth");
      } else {
        var u = user + '@' + domain;
        fsrtmp.register(u, "");
        // you logged in now with your sip credentials
      }
    }
  });
