'use strict';

describe('Service: messageRepo', function () {

  // load the service's module
  beforeEach(module('devApp'));

  // instantiate service
  var messageRepo;
  beforeEach(inject(function (_messageRepo_) {
    messageRepo = _messageRepo_;
  }));

  it('should do something', function () {
    expect(!!messageRepo).toBe(true);
  });

});
