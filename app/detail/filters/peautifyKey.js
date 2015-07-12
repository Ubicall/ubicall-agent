'use strict';

/**
 * @ngdoc filter
 * @name agentUiApp.filter:peautifyKey
 * @function
 * @description
 * # peautifyKey convert [start_time , start-time , start time => Start Time]
 * Filter in the agentUiApp.
 */
angular.module('agentUiApp')
  .filter('peautifyKey', function () {

    var capitalize = function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    var capitalizeEachWord  = function (str) {
      return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    };

    return function (key) {
      if (typeof key !== "string") {
        return key;
      }
      return capitalizeEachWord(key.replace(/-|_/g,' '));
    };
  });
