'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:DetailController
 * @description
 * # DetailController
 * Controller of the agentUiApp
 */
 angular.module('agentUiApp')
 .controller('DetailController', function ($scope ,$location ,$routeParams, Auth , CallCenter) {
 	if(!Auth.currentUser() || !Auth.currentUser().user){
 		Auth.logout().then(function(){
 			$location.path("/login");
 		})
 	}
 	var user = Auth.currentUser().user;
 	$scope.user= user;
 	$scope.calls = CallCenter.getCallDetail($routeParams.queueid,$routeParams.callid);
 	$scope.queues = CallCenter.getQueues(user);
 	$scope.callDetail= function(queueid,callid){
 		$location.path("#/call/"+queue.id+"/"+callid) 
 	}
 });
