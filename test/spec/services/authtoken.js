'use strict';

describe('Service: AuthToken', function () {

  // load the service's module
  beforeEach(module('agentUiApp'));

  // instantiate service
  var AuthToken;
  beforeEach(inject(function (_AuthToken_) {
    AuthToken = _AuthToken_;
  }));

  it('should do something', function () {
    expect(!!AuthToken).toBe(true);
  });

});
