'use strict';

describe('Controller: PhoneController', function () {

  // load the controller's module
  beforeEach(module('agentUiApp'));

  var PhoneCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PhoneCtrl = $controller('PhoneController', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
