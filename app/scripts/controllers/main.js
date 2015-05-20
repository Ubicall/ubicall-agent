'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the agentUiApp
 */
 angular.module('agentUiApp')
 .controller('MainController', function ($scope ,$location, Auth , CallCenter) {
 	if(!Auth.currentUser() || !Auth.currentUser().user){
 		Auth.logout().then(function(){
 			$location.path("/login");
 		})
 	}
 	var user = Auth.currentUser().user;
 	$scope.user= user;
 	$scope.calls = CallCenter.getAvailablesCalls(user);
 	$scope.queues = CallCenter.getQueues(user);

 	$scope.collapse=function(id){

 	};
 });
