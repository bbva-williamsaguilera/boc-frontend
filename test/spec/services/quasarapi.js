'use strict';

describe('Service: quasarApi', function () {

  // load the service's module
  beforeEach(module('quasarFrontendApp'));

  // instantiate service
  var quasarApi;
  beforeEach(inject(function (_quasarApi_) {
    quasarApi = _quasarApi_;
  }));

  it('should do something', function () {
    expect(!!quasarApi).toBe(true);
  });

});
