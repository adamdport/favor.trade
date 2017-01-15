'use strict';

/**
 * @ngdoc function
 * @name devApp.controller:WecomeCtrl
 * @description
 * # WelcomeCtrl
 * Controller of the devApp
 */
angular.module('devApp')
  .controller('WelcomeCtrl', ['$scope', 'favorRepo', 'favors', 'RESOURCES', 'userRepo', '_', 'location', 'onboarding', 'userWithLocation', '$uibModal', '$state', function ($scope, favorRepo, favors, RESOURCES, userRepo, _, location, onboarding, userWithLocation, $uibModal, $state) {
    $scope.RESOURCES = RESOURCES;
    $scope.step = 1;
    $scope.forms = {
      favors: {}
    };
    $scope.favors = [
      favors[0] || {title:""},
      favors[1] || {title:""},
      favors[2] || {title:""}
    ];
    $scope.user = userWithLocation;

    $scope.step2 = function(){
      if($scope.forms.favors.$valid){
        $scope.step = 2;
      }
    };

    $scope.terms = function(){
      $uibModal.open({
        templateUrl: 'views/terms.html'
      });
    };

    $scope.submit = function(){
      if($scope.forms.favors.$valid && $scope.forms.bio.$valid){
        favorRepo.saveFavors($scope.favors)
        .then(function(){
          return userRepo.saveBio($scope.user);
        }).then(function(){
          onboarding.finish();
          $state.go("home");
        },function(error){
          console.log(error);
        });
      }
    };
  }]);
