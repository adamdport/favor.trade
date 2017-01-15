'use strict';

describe('Service: referenceRepo', function () {

  // load the service's module
  beforeEach(module('devApp'));

  // instantiate service
  var referenceRepo;
  beforeEach(inject(function (_referenceRepo_) {
    referenceRepo = _referenceRepo_;
  }));

  it('should do something', function () {
    expect(!!referenceRepo).toBe(true);
  });

});
