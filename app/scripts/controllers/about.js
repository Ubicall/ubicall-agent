'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the agentUiApp
 */
angular.module('agentUiApp')
  .controller('AboutController', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
