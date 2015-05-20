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
 		{name:'waleed',image:"images/home-pic-04.jpg",title:'man we',fullName:'waleed samy',
 		phone:'+201069527634',date:'2/1/2013',time:'7:38:05 AM'},
 		{name:'waleed',image:"images/home-pic-04.jpg",title:'man we',fullName:'waleed samy',
 		phone:'+201069527634',date:'2/1/2013',time:'7:38:05 AM'},
 		{name:'waleed',image:"images/home-pic-04.jpg",title:'man we',fullName:'waleed samy',
 		phone:'+201069527634',date:'2/1/2013',time:'7:38:05 AM'}
 		];
 	};

 	this.getQueues = function(user){
 		return [
 		{
 			"id" : 1 ,"name" :"Customer Support", 
 			"items" : 
 			[
 			{"id" : 1 , "name" : "custome support 11"},
 			{"id" : 2, "name" : "custome support 11"}
 			]
 		},
 		{
 			"id" : 2, "name" :"Red",
 			"items" : 
 			[
 			{"id" : 1 , "name" : "Red 21"},
 			{"id" : 2, "name" : "Red 22"}
 			]
 		},
 		{
 			"id" : 3, "name":"New Customers", 
 			"items" : 
 			[
 			{"id" : 1 , "name" : "New Customers 31"},
 			{"id" : 2, "name" : "New Customers 32"}
 			]
 		}
 		];
 	};
 });
