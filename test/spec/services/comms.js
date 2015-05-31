'use strict';

describe('Service: comms', function () {

  // load the service's module
  beforeEach(module('agentUiApp'));

  // instantiate service
  var comms;
  beforeEach(inject(function (_comms_) {
    comms = _comms_;
  }));

  it('should do something', function () {
    expect(!!comms).toBe(true);
  });

});
