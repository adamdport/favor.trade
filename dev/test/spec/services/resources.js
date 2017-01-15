'use strict';

describe('Service: RESOURCES', function () {

  // load the service's module
  beforeEach(module('devApp'));

  // instantiate service
  var RESOURCES;
  beforeEach(inject(function (_RESOURCES_) {
    RESOURCES = _RESOURCES_;
  }));

  it('should do something', function () {
    expect(!!RESOURCES).toBe(true);
  });

});
