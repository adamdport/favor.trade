'use strict';

/**
 * @ngdoc service
 * @name devApp.favorRepo
 * @description
 * # favorRepo
 * Factory in the devApp.
 */
angular.module('devApp')
  .factory('favorRepo', ['Parse', '_', 'auth', 'map', function (Parse, _, auth, map) {
    var Favors = Parse.Object.extend("Favors");

    var favorRepo = {
      getMyFavors: function () {
        var query = new Parse.Query(Favors);
        query.equalTo("user", auth.getUser());
        query.limit(20);
        return query.find().then(map.favors);
      },
      getFavors: function(distance, units, search, skip, location){
        var point = location.lat !== null ? new Parse.GeoPoint({latitude: location.lat, longitude: location.lng}) : false;
        return Parse.Cloud.run("getFavorsByLocation", {
            distance: distance,
            units: units,
            search: search,
            skip: skip,
            location: point
          }, {});
      },
      getFavorsByUser: function(userid){
        return Parse.Cloud.run("getFavorsByUser", {
            userid: userid
          }, {});
      },
      saveFavors: function(favors){
        var favorsArray = [];
        favors.forEach(function(f){
          var favor = f.obj || new Favors();
          favor.set("title", f.title);
          favor.set("user", auth.getUser());
          favor.set("location", auth.getUser().get("location"));
          favorsArray.push(favor);
        });
        return Parse.Object.saveAll(favorsArray).then(map.favors);
      },
      deleteFavors: function(favors){
        var parseObjects = _.pluck(favors, 'obj');
        return Parse.Object.destroyAll(parseObjects);
      },
      flagFavor: function(favorid){
        return Parse.Cloud.run("flagFavor", {
          id: favorid
        });
      },
      updateLocation: function(location){
        return favorRepo.getMyFavors()
        .then(function(favors){
          var updates = _.chain(favors)
          .pluck('obj')
          .forEach(function(favor){
            favor.set("location", location);
          })
          .value();
          return Parse.Promise.as(updates);
        })
        .then(Parse.Object.saveAll);
      }
    };

    return favorRepo;
  }]);
