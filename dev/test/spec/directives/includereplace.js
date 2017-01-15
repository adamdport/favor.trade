'use strict';

describe('Directive: includeReplace', function () {

  // load the directive's module
  beforeEach(module('devApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<include-replace></include-replace>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the includeReplace directive');
  }));
});
