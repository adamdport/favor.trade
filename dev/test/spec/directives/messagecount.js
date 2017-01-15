'use strict';

describe('Directive: messageCount', function () {

  // load the directive's module
  beforeEach(module('devApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<message-count></message-count>');
    element = $compile(element)(scope);
    //expect(element.text()).toBe('this is the messageCount directive');
  }));
});
