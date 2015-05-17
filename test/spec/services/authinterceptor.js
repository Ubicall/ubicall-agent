'use strict';

describe('Service: AuthInterceptor', function () {

  // load the service's module
  beforeEach(module('agentUiApp'));

  // instantiate service
  var AuthInterceptor;
  beforeEach(inject(function (_AuthInterceptor_) {
    AuthInterceptor = _AuthInterceptor_;
  }));

  it('should do something', function () {
    expect(!!AuthInterceptor).toBe(true);
  });

});
