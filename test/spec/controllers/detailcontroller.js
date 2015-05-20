'use strict';

describe('Controller: DetailController', function () {

  // load the controller's module
  beforeEach(module('agentUiApp'));

  var DetailController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DetailController = $controller('DetailController', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
