'use strict';

/**
 * @ngdoc service
 * @name devApp.location
 * @description
 * # location
 * Factory in the devApp.
 */
angular.module('devApp')
  .factory('location', ['$http', '$q', function ($http, $q) {
    var location = {
      search: function (search) {
        return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            address: search
          }
        }).then(location.mapGoogleResponse);
      },
      fromParseLocation: function(parseLocation){
        return parseLocation?
          $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
            params: {
              latlng: parseLocation.latitude + "," + parseLocation.longitude
            }
          }).then(location.mapGoogleResponse)
          : $q.resolve(false);
      },
      mapGoogleResponse: function(response){
        if (response.data.results.length){
          return {
            lat: response.data.results[0].geometry.location.lat,
            lng: response.data.results[0].geometry.location.lng,
            formatted: response.data.results[0].formatted_address
          };
        }else{
          return false;
        }
      }
    };
    // Public API here
    return location;
  }]);
