'use strict';

/**
 * @ngdoc directive
 * @name devApp.directive:login
 * @description
 * # login
 */
angular.module('devApp')
  .directive('login', ['userRepo', '$state', '$rootScope', function (userRepo, $state, $rootScope) {
    return {
      restrict: 'A',
      scope: false,
      link: function postLink(scope, element) {
        function login(){
          console.log('logging in...');

          userRepo.login().then(function(user){
            console.log('logged in...');
            $rootScope.$broadcast('loggedIn', user);
            $state.go("home", {}, { reload: true });
          },function(user, error){
            console.log("couldn't log in", error);
          });
        }

        element.bind('click',login);
      }
    };
  }]);
