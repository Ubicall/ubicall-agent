'use strict';

/**
 * @ngdoc function
 * @name agentUiApp.directive:pwCheck
 * @description
 * # pwCheck
 * directive of the agentUiApp
 */
angular.module('agentUiApp')
  .directive('pwCheck', function() {
      return {
              require: 'ngModel',
              link: function (scope, elem, attrs, ctrl) {
                  var firstPassword = '#' + attrs.pwCheck;
                  $(elem).add(firstPassword).on('keyup', function () {
                      scope.$apply(function () {
                          var v = elem.val()===$(firstPassword).val();
                          ctrl.$setValidity('pwcheck', v);
                      });
                  });
              }
          }
  });
