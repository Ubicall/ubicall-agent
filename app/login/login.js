'use strict';

angular.module('agentUiApp')
  .controller('LoginController', function ($scope, $animate, $location, Auth, rtmp, UiService) {

    // hide error messages until 'submit' event
    $scope.submitted = false;

    // method called from shakeThat directive
    $scope.submit = function () {
      Auth.login($scope.email, $scope.password).then(function success() {
        // flash will load after you login 'ng-if isAuthenticated prevent this load'
        // when you logged in you next page will load flash and then will register you with backend communication server
        UiService.ok("you logged in but wait to connect you with communication server");
      }, function error() {
        UiService.error("credentials problem found");
      });
    };

  });
