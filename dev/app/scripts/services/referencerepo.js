'use strict';

/**
 * @ngdoc service
 * @name devApp.referenceRepo
 * @description
 * # referenceRepo
 * Factory in the devApp.
 */
angular.module('devApp')
  .factory('referenceRepo', ['Parse', '_', function (Parse, _) {
    var priv = {
      mapReferences: function(parseObjects){
        return _.map(parseObjects, function(parseObject){
          return priv.mapReference(parseObject);
        });
      },
      mapReference: function(parseObject){
        return {
          type: parseObject.get('type'),
          rating: parseObject.get('rating'),
          text: parseObject.get('text'),
          writtenBy: parseObject.get('writtenBy'),
          date: parseObject.createdAt
        };
      }
    };
    // Public API here
    var referenceRepo = {
      getReferences: function(userid){
        return Parse.Cloud.run("getReferences", {
          userid: userid
        });
      },
      saveReference: function(reference){
        return Parse.Cloud.run("saveReference", reference).then(priv.mapReference);
      }
    };
    return referenceRepo;
  }]);
