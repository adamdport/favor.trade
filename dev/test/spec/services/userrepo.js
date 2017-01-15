'use strict';

describe('Service: userRepo', function () {

  // load the service's module
  beforeEach(module('devApp'));

  // instantiate service
  var userRepo;
  beforeEach(inject(function (_userRepo_) {
    userRepo = _userRepo_;
  }));

  it('should do something', function () {
    expect(!!userRepo).toBe(true);
  });

});
