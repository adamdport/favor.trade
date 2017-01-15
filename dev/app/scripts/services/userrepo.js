'use strict';

/**
* @ngdoc service
* @name devApp.userRepo
* @description
* # userRepo
* Factory in the devApp.
*/
angular.module('devApp')
.factory('userRepo', ['auth', 'Parse', 'favorRepo', 'map', '$rootScope', function (auth, Parse, favorRepo, map, $rootScope) {
  //var publicUserCache = {};

  // Public API here
  var userRepo = {
    login: function(){
      return auth.login()
      .then(auth.getFbMe)
      .then(userRepo.syncFbMe)
      .then(userRepo.getMappedUser);
    },
    getMappedUser: function(){
      return map.user(auth.getUser());
    },
    getPublicUser: function(userid){
      return Parse.Cloud.run("getUserById", {
        userid: userid
      });
    },
    getLocalUsers: function(distance, units, skip){
      return Parse.Cloud.run("getUsersByLocation", {
        distance: distance,
        units: units,
        skip: skip
      });
    },
    syncFbMe: function(me){
      var user = auth.getUser();
      user.set("picture", me.picture.data.url);
      user.set("first_name", me.first_name);
      user.set("last_name", me.last_name);
      user.set("gender", me.gender);
      user.set("birthday", me.birthday);
      user.set("email", me.email);
      return user.save();
    },
    saveBio: function(me){

      //update user
      var user = auth.getUser();
      user.set("bio", me.bio);
      var point = new Parse.GeoPoint({latitude: me.location.lat, longitude: me.location.lng});
      user.set("location", point);
      if(user.get("emailWhenMessaged") === undefined){ //A new user hasn't set "emailWhenMessaged" yet
        user.set("emailWhenMessaged", true);
      }
      if(user.get("emailWhenReferenced")  === undefined){ //A new user hasn't set "emailWhenReferenced" yet
        user.set("emailWhenReferenced", true);
      }

      return Parse.Promise.when(
        favorRepo.updateLocation(point),
        user.save() //update the user himself
      );
    },
    emailWhenMessaged: function(enabled){
      var user = auth.getUser();
      user.set("emailWhenMessaged", enabled);
      return user.save().then(map.user);
    },
    emailWhenReferenced: function(enabled){
      var user = auth.getUser();
      user.set("emailWhenReferenced", enabled);
      return user.save().then(map.user);
    },
    deleteUser: function(){
      var user = auth.getUser();
      return user.destroy().then(auth.logOut).then(function(){
        $rootScope.$broadcast('loggedIn', undefined); //removes user from header
      });
    },
  };

  return userRepo;
}]);
