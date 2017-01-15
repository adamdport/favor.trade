'use strict';

/**
 * @ngdoc directive
 * @name devApp.directive:includeReplace
 * @description
 * # includeReplace
 */
angular.module('devApp')
  .directive('includeReplace', function () {
    return {
        require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el) {
            el.replaceWith(el.children());
        }
    };
  });
