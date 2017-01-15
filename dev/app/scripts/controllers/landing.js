"use strict";

/**
 * @ngdoc function
 * @name devApp.controller:LandingCtrl
 * @description
 * # LandingCtrl
 * Controller of the devApp
 */
angular.module("devApp")
  .controller("LandingCtrl", ["$scope", "onboarding", "Parse", "cookies", 'RESOURCES', 'ga', 'auth', '$state', function ($scope, onboarding, Parse, cookies, RESOURCES, ga, auth, $state) {
    if (auth.getUser()){
      $state.go("home");
    }

    //if cookie is set, that's the default
    $scope.mode = cookies.landing.get();
    if ($scope.mode === undefined){
      // if (Math.random() >= 0.5){
      //   $scope.mode = "favor";
      // }else{
      //   $scope.mode = "trade";
      // }
      $scope.mode = "favor";
      cookies.landing.put($scope.mode);
    }

    $scope.signedUp = cookies.signedup.get(); //$cookies.get("signedup");
    $scope.RESOURCES = RESOURCES;

    var signedUp = function(){
      cookies.signedup.put(true); //$cookies.put("signedup", true);
      $scope.signedUp = true;
    };

    $scope.submitEmail = function(){
      var dimensions = {
        email: $scope.email,
        state: $scope.mode
      };

    Parse.Analytics.track("signup", dimensions);

    var Signups = Parse.Object.extend("signups");
    var signups = new Signups();

    signups.set("email", $scope.email);
    signups.set("state", $scope.mode);

    signups.save(null, {
      success: function() {
        // Execute any logic that should take place after the object is saved.
        signedUp();
      },
      error: function(s, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        console.log(s);
        console.log(error.message);
        ga("send", "exception", {
          "exDescription": error.message,
        });
      }
    });

    };
  }]);
