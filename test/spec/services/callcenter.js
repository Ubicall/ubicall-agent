'use strict';

describe('Service: CallCenter', function () {

  // load the service's module
  beforeEach(module('agentUiApp'));

  // instantiate service
  var CallCenter;
  beforeEach(inject(function (_CallCenter_) {
    CallCenter = _CallCenter_;
  }));

  it('should do something', function () {
    expect(!!CallCenter).toBe(true);
  });

});
