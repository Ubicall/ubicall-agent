'use strict';

angular.module('agentUiApp')
  .controller('LoginController', function ($scope, $animate, $location, Auth, rtmp, UiService) {

    // hide error messages until 'submit' event
    $scope.submitted = false;

    // method called from shakeThat directive
    $scope.submit = function () {
      Auth.login($scope.email, $scope.password).then(function success() {
        $scope.$on('rtmp:ready', function (event, info) {
            rtmp.login();            
            UiService.add('success', "you logged in and connected with callcenter server");
        });
        UiService.add('success', "you logged in but wait to connect you with callcenter server");
        $location.path('/recent');
      }, function error() {
        UiService.add('danger', "crednetial problem found");
      });
    };

  })
  .directive('shakeThat', ['$animate', function ($animate) {

    return {
      require: '^form',
      scope: {
        submit: '&',
        submitted: '='
      },
      link: function (scope, element, attrs, form) {

        // listen on submit event
        element.on('submit', function () {

          // tell angular to update scope
          scope.$apply(function () {

            // everything ok -> call submit fn from controller
            if (form.$valid) return scope.submit();

            // show error messages on submit
            scope.submitted = true;

            // shake that form
            $animate.addClass(element, 'shake', function () {
              $animate.removeClass(element, 'shake');
            });

          });

        });

      }
    };

  }]);
