'use strict';

describe('Service: rtmp', function () {

  // load the service's module
  beforeEach(module('agentUiApp'));

  // instantiate service
  var rtmp;
  beforeEach(inject(function (_rtmp_) {
    rtmp = _rtmp_;
  }));

  it('should do something', function () {
    expect(!!rtmp).toBe(true);
  });

});
