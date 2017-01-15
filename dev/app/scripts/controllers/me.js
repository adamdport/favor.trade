'use strict';

/**
 * @ngdoc function
 * @name devApp.controller:MeCtrl
 * @description
 * # MeCtrl
 * Controller of the devApp
 */
angular.module('devApp')
  .controller('MeCtrl', ['$scope', '$state', 'tabData', function ($scope, $state, tabData) {
    $scope.go = function(state) {
      $state.go(state);
    };

    $scope.tabData = tabData;
}]);
