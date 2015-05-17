'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.alert
 * @description
 * # alert
 * Factory in the agentUiApp.
 */
 angular.module('agentUiApp')
 .factory('alertService',function ($timeout) {
  var service = {
    add: add,
    closeAlert: closeAlert,
    closeAlertIdx: closeAlertIdx,
    clear: clear,
    get: get
  },
  alerts = [];
  add('danger','Oh snap! Change a few things up and try submitting again.');
  add('success','Well done! You successfully read this important alert message.');

  return service;

  function add(type, msg ,tout) {
    var that = this;
    tout = tout || 6000 ; //6 seconds
    $timeout(function(){ 
      closeAlert(that); 
    }, tout); 
    return alerts.push({
      type: type,
      msg: msg,
      closeable:true,
      close: function() {
        return closeAlert(that);
      }
    });
  }

  function closeAlert(alert) {
    return closeAlertIdx(alerts.indexOf(alert));
  }

  function closeAlertIdx(index) {
    return alerts.splice(index, 1);
  }

  function clear(){
    alerts = [];
  }

  function get() {
    return alerts;
  }
});