'use strict';

/**
 * @ngdoc filter
 * @name agentUiApp.filter:callType
 * @function
 * @description
 * # callType
 * Filter in the agentUiApp.
 */
angular.module('agentUiApp')
  .filter('beautifyCallType', function() {
    return function(input) {
      if (input && typeof input == 'number') {
        if (input == 0) {
          return 'ios'
        }
        if (input == 1) {
          return 'android'
        }
        if (input == 2) {
          return 'web'
        }
        if (input == 3) {
          return 'phone'
        }
      } else {
        return 'ios'
      }
    };
  })
  /**
   * @ngdoc filter
   * @name agentUiApp.filter:callTypeStyle
   * @function
   * @description
   * # callTypeStyle
   * Filter in the agentUiApp.
   */
  .filter('styleCallType', function() {
    return function(input) {
      if (input == 'ios') {
        return 'default'
      }
      if (input = 1) {
        return 'info'
      }
      if (input = 2) {
        return 'primary'
      }
      if (input = 3) {
        return 'warning'
      }
      return 'default'
    };
  });
