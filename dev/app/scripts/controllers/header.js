'use strict';

/**
 * @ngdoc function
 * @name devApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the devApp
 */
angular.module('devApp')
  .controller('HeaderCtrl', ['$scope', 'auth', 'userRepo', 'onboarding', '$state', function ($scope, auth, userRepo, onboarding, $state) {
    $scope.user = userRepo.getMappedUser();
    $scope.$state = $state;

    $scope.$on('loggedIn', function(event, user){
      $scope.user = user;
    });

    $scope.logout = function(){
      auth.logOut();
      $scope.user = false;
    };
  }]);
