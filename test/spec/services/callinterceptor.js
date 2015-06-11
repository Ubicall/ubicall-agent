'use strict';

describe('Service: callInterceptor', function () {

  // load the service's module
  beforeEach(module('agentUiApp'));

  // instantiate service
  var callInterceptor;
  beforeEach(inject(function (_callInterceptor_) {
    callInterceptor = _callInterceptor_;
  }));

  it('should do something', function () {
    expect(!!callInterceptor).toBe(true);
  });

});
