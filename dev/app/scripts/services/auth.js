'use strict';

/**
 * @ngdoc service
 * @name devApp.auth
 * @description
 * # auth
 * Factory in the devApp.
 */
angular.module('devApp')
  .factory('auth', ['$window', '$q', '$state', 'location', 'cookies', 'Parse', '$rootScope', function ($window, $q, $state, location, cookies, Parse, $rootScope) {
    var fbDeferred = $q.defer();

    // Service logic
    // ...
    $window.fbAsyncInit = function() {
      Parse.FacebookUtils.init({
        appId      : '261291654052391',                    // App ID from the app dashboard
        xfbml      : false,                                // Look for social plugins on the page
        version    : 'v2.2' // use version 2.2
      });
      fbDeferred.resolve($window.FB);
    };

    var auth = {
      login: function(){
        return auth.getFB()
        .then(function(){
          var loginDeferred = $q.defer();
          Parse.FacebookUtils.logIn("user_birthday, email", {
            success: function(){
              loginDeferred.resolve();
            },
            error: function(){
              loginDeferred.reject();
            }
          });
          return loginDeferred.promise;
        });
      },
      getFB: function(){
        return fbDeferred.promise;
      },
      getUser: function(){
        return Parse.User.current();
      },
      getFbMe: function(){
        return auth.getFB().then(function(FB){
          var deferred = $q.defer();
          FB.api('/me', {fields: 'picture, first_name, last_name, gender, birthday, email'}, function(response) {
            if (response.error){
              deferred.reject(response);
            }else{
              deferred.resolve(response);
            }
          });
          return deferred.promise;
        });
      },
      logOut: function(){
        cookies.onboarding.remove(); //$cookies.remove("onboarding");
        return Parse.User.logOut().then(function(){
          $state.go('landing', {}, {reload: true});
          $rootScope.$broadcast('logout');
        });
      }
    };

    return auth;
  }]);
