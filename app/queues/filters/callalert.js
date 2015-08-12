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
        if (input < 5) {
          return 'alert-success'
        }
        if (input < 10) {
          return 'alert-info'
        }
        if (input < 15) {
          return 'alert-warning'
        }
        return 'alert-danger'
      } else {
        return 'alert-danger'
      }
    };
  });
