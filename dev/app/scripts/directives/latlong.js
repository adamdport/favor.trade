'use strict';

/**
 * @ngdoc directive
 * @name devApp.directive:latlong
 * @description
 * # latlong
 */
angular.module('devApp')
  .directive('latlong', ['location', '$timeout', function (location, $timeout) {
    return {
      templateUrl: "views/partials/latlong.html",
      restrict: 'E',
      scope: {
        searchField: '=',
        lat: '=',
        lng: '=',
        frm: '=',
        onchange: '='
      },
      link: function postLink(scope) {
        scope.search = function(){
          scope.formatted = false;
          scope.lat = false;
          scope.lng = false;
          return location.search(scope.searchField)
          .then(function(results){
            if(results){
              scope.formatted = results.formatted;
              scope.lat = results.lat;
              scope.lng = results.lng;
            }
          }).then(function(){
            $timeout(scope.onchange);
          });
        };
      }
    };
  }]);
