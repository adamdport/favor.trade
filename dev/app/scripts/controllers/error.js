'use strict';

/**
 * @ngdoc function
 * @name devApp.controller:ErrorCtrl
 * @description
 * # ErrorCtrl
 * Controller of the devApp
 */
angular.module('devApp')
  .controller('ErrorCtrl', ['$scope', '$stateParams', 'ga', function ($scope, $stateParams, ga) {
    $scope.error = $stateParams.error.message || $stateParams.error;

    ga('send', 'exception', {
      'exDescription': $scope.error,
      'exFatal': true
    });
  }]);
