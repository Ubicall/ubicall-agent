'use strict';

/**
 * @ngdoc service
 * @name agentUiApp.CallCenter
 * @description
 * # CallCenter
 * Service in the agentUiApp.
 */
 angular.module('agentUiApp')
 .service('CallCenter', function () {
 	this.getAvailablesCalls = function(user) {
 		return [
 		{name:'waleed',title:'man we',fullName:'waleed samy',
 		phone:'+201069527634',date:'2/1/2013',time:'7:38:05 AM'},
 		{name:'waleed',title:'man we',fullName:'waleed samy',
 		phone:'+201069527634',date:'2/1/2013',time:'7:38:05 AM'},
 		{name:'waleed',title:'man we',fullName:'waleed samy',
 		phone:'+201069527634',date:'2/1/2013',time:'7:38:05 AM'}
 		];
 	};

 	this.getQueues = function(user){
 		return [
 		{id : 1, items : [{id : 1 , name : 11},{id : 2, name : 12}]},
 		{id : 2, items : [{id : 1 , name : 21},{id : 2, name : 22}]},
 		{id : 3, items : [{id : 1 , name : 31},{id : 2, name : 32}]}
 		];
 	};
 });
