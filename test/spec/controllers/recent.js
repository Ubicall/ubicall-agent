'use strict';

describe('Controller: RecentController', function () {

  // load the controller's module
  beforeEach(module('agentUiApp'));

  var RecentController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecentController = $controller('RecentController', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
