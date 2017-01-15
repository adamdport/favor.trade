'use strict';

/**
 * @ngdoc service
 * @name devApp.cookies
 * @description This factory provides a single place to declare cookie keys.
 *  It is now impossible to manipulate a cookie that has not been declared here.
 * # cookies
 * Factory in the devApp.
 */
angular.module('devApp')
  .factory('cookies', ['$cookies', function ($cookies) {

    //set all possible cookie keys here
    var keys = ["landing", "signedup", "onboarding", "searchParams"];

    var getFunctions = function(key){
      return {
        get: function () {
          return $cookies.get(key);
        },
        getObject: function() {
          return $cookies.getObject(key);
        },
        put: function(data, options){
          if(options){
            $cookies.put(key, data, options);
          }else{
            $cookies.put(key, data);
          }
        },
        putObject: function(data, options){
          if(options){
            $cookies.putObject(key, data, options);
          }else{
            $cookies.putObject(key, data);
          }
        },
        remove: function(){
          $cookies.remove(key);
        }
      };
    };

    var ret = {};
    keys.forEach(function(key){
      ret[key] = getFunctions(key);
    });

    // Public API here
    return ret; //cookies.landing.get() and cookies.landing.put("value");
  }]);
