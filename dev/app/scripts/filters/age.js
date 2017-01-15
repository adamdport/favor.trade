'use strict';

/**
 * @ngdoc filter
 * @name devApp.filter:age
 * @function
 * @description
 * # age
 * Filter in the devApp.
 */
angular.module('devApp')
.filter('ageFilter', function () {
  function calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  return function(birthdate) {
    if (birthdate){
      var date = new Date( birthdate.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
      return calculateAge(date);
    }
  };
});
