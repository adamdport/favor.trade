'use strict';

/**
 * @ngdoc service
 * @name devApp.onboarding
 * @description
 * # onboarding
 * Factory in the devApp.
 */
angular.module('devApp')
  .factory('onboarding', ['favorRepo', 'cookies', '$q', function (favorRepo, cookies, $q) {
    // Public API here
    var onboarding = {
      checkIfComplete: function () {
        if(cookies.onboarding.get() === "complete"){
          return $q.when(true);
        }else{
          return favorRepo.getMyFavors().then(function(favors){
            var deferred = $q.defer();
            if (favors.length >= 3){
              onboarding.finish();
              deferred.resolve();
            }else{
              deferred.reject("onboarding");
            }
            return deferred.promise;
          });
        }
      },
      finish: function(){
        // Find tomorrow's date.
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1);
        // Set a cookie
        cookies.onboarding.put("complete", {'expires': expireDate}); //$cookies.put("onboarding", "complete", tomorrow);
      },
      reset: function(){
        cookies.onboarding.remove(); //$cookies.remove("onboarding");
      }
    };

    return onboarding;
  }]);
