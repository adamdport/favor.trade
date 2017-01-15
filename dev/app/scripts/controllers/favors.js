'use strict';

/**
 * @ngdoc function
 * @name devApp.controller:FavorsCtrl
 * @description
 * # FavorsCtrl
 * Controller of the devApp
 */
angular.module('devApp')
  .controller('FavorsCtrl', ['$scope', 'favors', 'favorRepo', '$state', 'RESOURCES', '_', 'user', function ($scope, favors, favorRepo, $state, RESOURCES, _, user) {
    $scope.favors = favors;
    $scope.RESOURCES = RESOURCES;
    $scope.user = user;

    $scope.xformClass = 'col-sm-9 col-xs-12';

    $scope.updateFavor = function(favor, title){
      if(!favor.obj){
        this.$form.$editables[0].scope.$data = ''; //If it is a new favor, clear the input
      }
      favor.title = title;
      favorRepo.saveFavors([favor]).then(function(saved){
        if(!favor.obj){ //if it is a new favor, add it to the array
          $scope.favors.push(saved[0]);
        }
      }, function(error){
        $scope.error = "Something went wrong! " + (error.message || error);
      });
    };

    $scope.deleteFavor = function(favor){
      favorRepo.deleteFavors([favor]).then(function(){
        _.remove($scope.favors, function(f){
          return favor.obj.id === f.obj.id;
        });
      });
    };
  }]);
