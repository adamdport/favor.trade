'use strict';

/**
 * @ngdoc directive
 * @name devApp.directive:messageCount
 * @description
 * # messageCount
 */
angular.module('devApp')
  .directive('messageCount', ['messageRepo', function (messageRepo) {
    return {
      template: '',
      restrict: 'A',
      scope: {
        messageCount: '='
      },
      link: function postLink(scope) {
        var refresh = function(){
          messageRepo.getUnreadCount().then(function(count){
            scope.messageCount = count;
          });
        };

        scope.$on('$stateChangeSuccess', refresh);
        scope.$on('newMessage', refresh);
      }
    };
  }]);
