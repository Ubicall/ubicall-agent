'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.alert
 * @description
 * # alert
 * Factory in the agentUiApp.
 */
angular.module('agentUiApp')
  .factory('helpers', function (moment) {

    function isDate(value){
      // see http://stackoverflow.com/a/1353710
      // not use angular.isDate https://github.com/angular/angular.js/blob/master/src/Angular.js#L583
      return !isNaN( Date.parse(value) );
    }

    function diffDates(endDate, startDate ,format) {
      format = format || 'HH:mm:ss';
      return moment.utc(moment(endDate).diff(moment(startDate))).format(format);
    };

    function isJson (str) {
      if (!str || isNumber(str)) {
        return false;
      }
      if (typeof str == 'object') {
        return true;
      }
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    };

    function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    };

    function isEmptyObject(obj){
        if(obj){
          return Object.keys(obj).length === 0 ? true : false;
        }else {
          return true;
        }
    }

    return {
      isDate : isDate,
      isNumber: isNumber,
      isJson: isJson,
      isEmptyObject: isEmptyObject,
      diffDates: diffDates
    }
  });
