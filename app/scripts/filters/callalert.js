'use strict';

/**
 * @ngdoc filter
 * @name agentUiApp.filter:callAlert
 * @function
 * @description
 * # callAlert
 * Filter in the agentUiApp.
 */
angular.module('agentUiApp')
  .filter('callAlert', function () {
    return function (input) {
      if (typeof  input == 'number') {
        if (input < 25) {
          return 'alert-success'
        }
        if (input < 50) {
          return 'alert-info'
        }
        if (input < 75) {
          return 'alert-warning'
        }
        return 'alert-danger'
      } else {
        return 'alert-danger'
      }
    };
  });
