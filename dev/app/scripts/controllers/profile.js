'use strict';

/**
 * @ngdoc function
 * @name devApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the devApp
 */
angular.module('devApp')
  .controller('ProfileCtrl', ['$scope', 'userWithLocation', 'RESOURCES', 'userRepo', function ($scope, userWithLocation, RESOURCES, userRepo) {
    $scope.user = userWithLocation;

    $scope.RESOURCES = RESOURCES;

    $scope.submit = function(){
      if($scope.forms.bio.$valid){
        userRepo.saveBio($scope.user).then(function(){
          $scope.success = true;
        });
      }
    };
  }]);
