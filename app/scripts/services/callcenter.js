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
 	var calls ;
 	this.getAvailablesCalls = function(user) {
 		calls=
 		[{callid :1,queueid:1,name:'waleed',image:"images/home-pic-04.jpg",pigImage:"images/home-pic-01.jpg",title:'man we',fullName:'waleed samy',
 		phone:'+201069527634',date:'2/1/2013',time:'7:38:05 AM'},
 		{callid :2,queueid:2,name:'waleed',image:"images/home-pic-04.jpg",pigImage:"images/home-pic-01.jpg",title:'man we',fullName:'waleed samy',
 		phone:'+201069527634',date:'2/1/2013',time:'7:38:05 AM'},
 		{callid :3,queueid:3,name:'waleed',image:"images/home-pic-04.jpg",pigImage:"images/home-pic-01.jpg",title:'man we',fullName:'waleed samy',
 		phone:'+201069527634',date:'2/1/2013',time:'7:38:05 AM'}
 		];

 		return calls;
 	};

 	this.getCallDetail = function(queueid,callid){
 		var call = [];
 		angular.forEach(calls, function(item) {
 			if(item.callid===callid && item.queueid===queueid){
 				this.push(item);
 			}
 		}, call);

 		call ={name:'waleed',image:"images/home-pic-04.jpg",
 		pigImage:"images/home-pic-01.jpg",title:'man we',fullName:'waleed samy',
 		phone:'+201069527634',date:'2/1/2013',time:'7:38:05 AM'};
 		return call;
 	}

 	this.getQueues = function(user){
 		return [
 		{
 			"queueid" : 1 ,"name" :"Customer Support", 
 			"calls" : 
 			[
 			{"callid" : 1 , "name" : "custo"},
 			{"callid" : 2, "name" : "custome support 11"}
 			]
 		},
 		{
 			"queueid" : 2, "name" :"Red",
 			"calls" : 
 			[
 			{"callid" : 1 , "name" : "Red 21"},
 			{"callid" : 2, "name" : "Red 22"}
 			]
 		},
 		{
 			"queueid" : 3, "name":"New Customers", 
 			"calls" : 
 			[
 			{"callid" : 1 , "name" : "New Customers 31"},
 			{"callid" : 2, "name" : "New Customers 32"}
 			]
 		}
 		];
 	};
 });
