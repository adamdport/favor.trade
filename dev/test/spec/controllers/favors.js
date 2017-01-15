'use strict';

describe('Controller: FavorsCtrl', function () {

  // load the controller's module
  beforeEach(module('devApp'));

  var FavorsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FavorsCtrl = $controller('FavorsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   //expect(FavorsCtrl.awesomeThings.length).toBe(3);
  // });
});
