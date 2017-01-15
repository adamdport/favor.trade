'use strict';

/**
 * @ngdoc function
 * @name devApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the devApp
 */
angular.module('devApp')
  .controller('HomeCtrl', ['$scope', 'favorRepo', 'userRepo', 'RESOURCES', 'messageRepo', 'cookies', '$timeout', 'user', '_', function ($scope, favorRepo, userRepo, RESOURCES, messageRepo, cookies, $timeout, user, _) {
    $scope.RESOURCES = RESOURCES;
    $scope.searchOptions = {
      mode: ['Favors','People'],
      distance:  [5, 10, 15, 20, 30, 40, 100],
      distanceUnits:  ['miles', 'kilometers']
    };
    var defaultSearchParams = {
      mode: $scope.searchOptions.mode[0], //Favors
      distance: $scope.searchOptions.distance[3], //20
      distanceUnit: $scope.searchOptions.distanceUnits[0] //miles
    };
    if(!user){
      $scope.searchParams = defaultSearchParams;
    }else{
      $scope.searchParams = cookies.searchParams.getObject() || defaultSearchParams;
    }
    $scope.favors = [];
    $scope.forms = {};
    $scope.user = user;

    function searchReset(){
      $scope.favors = [];
      $scope.users = [];
      $scope.allShown = false;
      $scope.loading = false;
    }
    searchReset();

    $scope.search = function(){
      searchReset();
      cookies.searchParams.putObject(_.omit($scope.searchParams, "search")); //store the current search in a cookie
      $scope.more(); //do the search
    };

    $scope.location = {
      search: $scope.search
    };

    $scope.more = function(){
      if ($scope.loading || $scope.allShown){
        return;
      }
      if (!$scope.user && !($scope.location.lat && $scope.location.lng)){
        return;
      }
      $scope.loading = true;
      if($scope.searchParams.mode === "Favors"){
        favorRepo.getFavors($scope.searchParams.distance, $scope.searchParams.distanceUnit, $scope.searchParams.search, $scope.favors.length, $scope.location).then(function(favors){
          $scope.favors.push.apply($scope.favors, favors);
          $scope.allShown = !favors.length;
          loadingFinished();
        });
      }else{
        userRepo.getLocalUsers($scope.searchParams.distance, $scope.searchParams.distanceUnit, $scope.users.length).then(function(users){
          $scope.users = $scope.users.concat(users);
          $scope.allShown = !users.length;
          loadingFinished();
        });
      }
    };

    function loadingFinished(){
      //an instant timeout will run after the digest cycle is complete.
      //This is done to avoid infiniteScroll from immediately firing again
      $timeout(function(){
        $scope.loading = false;
      }, 0);
    }

    $scope.sendMessage = function(favor){
      messageRepo.sendMessageFromFavor(favor)
      .then(
        function(){
          favor.messaged = true;
          favor.messageError = false;
        },function(){
          favor.messaged = false;
          favor.messageError = true;
      });
    };
  }]);
