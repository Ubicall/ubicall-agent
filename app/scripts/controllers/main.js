'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('MainController', function ($scope, $location, comms, Auth, CallCenter) {
    if (!Auth.currentUser() || !Auth.currentUser().user) {
      Auth.logout().then(function () {
        $location.path("/login");
      })
    } else {
      var user = Auth.currentUser().user;
      $scope.user = user;

      $scope.calls = $scope.queues = [];
      $scope.totalCalls = 0;

      CallCenter.getAvailableCalls().then(function (calls) {
        $scope.totalCalls = calls.length;
        $scope.calls = calls;
      });
      CallCenter.getQueues().then(function (queues) {
        $scope.queues = queues;
      });


      comms.subscribe("call", function (topic, msg) {
        var newcalls = [{
          name: 'new new', image: "images/home-pic-04.jpg",
          pigImage: "images/home-pic-01.jpg", title: 'new new', fullName: 'new new',
          phone: '+201069527634', date: '2/1/2013', time: '7:38:05 AM'
        }, {
          name: 'new new', image: "images/home-pic-04.jpg",
          pigImage: "images/home-pic-01.jpg", title: 'new new', fullName: 'new new',
          phone: '+201069527634', date: '2/1/2013', time: '7:38:05 AM'
        }];
        $scope.calls = newcalls.concat($scope.calls);
      });
    }
  });
