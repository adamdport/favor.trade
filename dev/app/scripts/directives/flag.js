'use strict';

/**
 * @ngdoc directive
 * @name devApp.directive:flag
 * @description
 * # flag
 */
angular.module('devApp')
.directive('flag', ['favorRepo', function (favorRepo) {
  return {
    template: '<span ng-click="flag($event)" class="glyphicon glyphicon-flag text-muted" uib-tooltip="Flag this favor if it isn\'t appropriate (if you wouldn\'t want your grandma to see this.)"></span>',
    restrict: 'A',
    scope: {
      favorid: '='
    },
    link: function postLink(scope, element) {
      scope.flag = function(e){
        e.preventDefault();
        e.stopPropagation();
        favorRepo.flagFavor(scope.favorid).then(markAsFlagged);
      };

      var markAsFlagged = function(){
        element.removeClass('glyphicon glyphicon-flag');
        element.text('Flagged!');
      };
    }
  };
}]);
