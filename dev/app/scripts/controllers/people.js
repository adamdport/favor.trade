'use strict';

/**
 * @ngdoc function
 * @name devApp.controller:PeopleCtrl
 * @description
 * # PeopleCtrl
 * Controller of the devApp
 */
angular.module('devApp')
  .controller('PeopleCtrl', ['$scope','user','references','referenceRepo','RESOURCES', '_', 'me', 'alreadyLeftReference', 'favors', function ($scope, user, references, referenceRepo, RESOURCES, _, me, alreadyLeftReference, favors) {
    $scope.user = user;
    $scope.me = user.id === me.id;
    $scope.references = references;
    $scope.favors = favors;
    $scope.RESOURCES = RESOURCES;
    $scope._ = _;
    $scope.display = {
      referenceFormButton: !alreadyLeftReference,
      referenceForm: false,
      references: false,
      favors: false
    };
    $scope.newReference = {
      userid: user.id
    };
    $scope.typeOptions = [
      {pretty: "I'm friends with " + $scope.user.first_name, val: "friends"},
      {pretty: "I did a favor for " + $scope.user.first_name, val: "doer"},
      {pretty: $scope.user.first_name + " did a favor for me", val: "receiver"},
      {pretty: "Other", val: "other"}
    ];

    $scope.ratingOptions = [
      {pretty: "Positive", val: 1},
      {pretty: "Neutral", val: 0},
      {pretty: "Negative", val: -1}
    ];

    $scope.saveReference = function(){
      referenceRepo.saveReference($scope.newReference).then(function(reference){
        reference.writtenBy = me; //We don't have the mapped user here
        $scope.references.push(reference);
        $scope.display.referenceForm = false;
        $scope.display.referenceFormButton = false;
      }).fail(function(){
        $scope.referenceError = true;
      });
    };
  }]);
