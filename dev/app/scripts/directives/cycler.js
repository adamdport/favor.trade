'use strict';

/**
 * @ngdoc directive
 * @name devApp.directive:cycler
 * @description
 * # cycler
 */
angular.module('devApp')
  .directive('cycler', ['_', '$timeout', '$q', function (_, $timeout, $q) {
    return {
      restrict: 'A',
      scope: {
        items: '=',
        cycle: '@'
      },
      link: function(scope, element){
        var i = 0;
        var items = _.shuffle(scope.items);

        var changeItem = function(){
          typewrite(items[i]).then(function(){
            i = (i === items.length - 1) ? 0 : i + 1;
            var timeToRead = Math.min(3000, 50 * items[i].length);
            $timeout(function() {
              changeItem();
            }, timeToRead, false);
          });
        },set = function(v){
          switch(scope.cycle){
            case "text":
              element.text(v);
              break;
            case "placeholder":
              if(element.is(':focus')){
                element.attr('placeholder', "");
              }else{
                element.attr('placeholder', v);
              }
              break;
            default:
              element.val(v);
          }
        },get = function(){
          switch(scope.cycle){
            case "text":
              return element.text();
            case "placeholder":
              return element.attr('placeholder');
            default:
              return element.val();
          }
        },typewrite = function(val){
          var i = 0;
          var deferred = $q.defer();
          set("");

          var go = function(){
            $timeout(function(){
              set(get() + val[i]);
              i++;
            }, _.random(20, 100), false)
            .then(function(){
              if (i < val.length){
                go();
              }else{
                deferred.resolve();
              }
            });
          };

          go();
          return deferred.promise;
        };

        changeItem();
      }
    };
  }]);
