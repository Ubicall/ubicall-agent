'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.directive:pwCheck
 * @description
 * # pwCheck
 * directive of the agentUiApp
 */
 angular.module('agentUiApp')
  .directive("fileread", function () {
      return {
          scope: {
              fileread: "="
          },
          link: function (scope, element, attributes) {
              element.bind("change", function (changeEvent) {
                  el.bind('change', function(event){
                    var files = event.target.files;
                    var file = files[0];

                    ngModel.$setViewValue(file);
                    $scope.$apply();
                });
              });
          }
      }
  });
