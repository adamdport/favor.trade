'use strict';

/**
 * @ngdoc function
 * @name devApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the devApp
 */
angular.module('devApp')
  .controller('SettingsCtrl', ['$scope', 'userRepo', 'favorRepo', 'onboarding', 'user', function ($scope, userRepo, favorRepo, onboarding, user) {
    var setUser = function(user){
      $scope.user = user;
    };

    $scope.emailWhenMessaged = function(enable){
      userRepo.emailWhenMessaged(enable).then(setUser);
    };

    $scope.emailWhenReferenced = function(enable){
      userRepo.emailWhenReferenced(enable).then(setUser);
    };

    $scope.delete = function(){
      onboarding.reset();

      userRepo.deleteUser();
    };

    setUser(user);
  }]);
