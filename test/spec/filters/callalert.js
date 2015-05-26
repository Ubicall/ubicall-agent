'use strict';

describe('Filter: callAlert', function () {

  // load the filter's module
  beforeEach(module('agentUiApp'));

  // initialize a new instance of the filter before each test
  var callAlert;
  beforeEach(inject(function ($filter) {
    callAlert = $filter('callAlert');
  }));

  it('should return the input prefixed with "callAlert filter:"', function () {
    var text = 'angularjs';
    expect(callAlert(text)).toBe('callAlert filter: ' + text);
  });

});
