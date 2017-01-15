'use strict';

/**
 * @ngdoc service
 * @name devApp.map
 * @description
 * # map
 * Factory in the devApp.
 */
angular.module('devApp')
  .factory('map', ["_", function (_) {
    var map = {
      favors: function(parseObjects){
        return _.map(parseObjects, function(parseObject){
          return map.favor(parseObject);
        });
      },
      favor: function(parseObject){
        return {
          obj: parseObject,
          title: parseObject.get('title'),
          user: map.user(parseObject.get('user'))
        };
      },
      user: function(user){
        return user ? {
          obj: user,
          id: user.id,
          picture: user.get("picture"),
          first_name: user.get("first_name"),
          last_name: user.get("last_name"),
          gender: user.get("gender"),
          birthday: user.get("birthday"),
          bio: user.get("bio"),
          emailWhenMessaged: user.get("emailWhenMessaged"),
          emailWhenReferenced: user.get("emailWhenReferenced"),

        } : false;
      }
    };

    return map;
  }]);
