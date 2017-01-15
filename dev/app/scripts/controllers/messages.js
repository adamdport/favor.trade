'use strict';

/**
 * @ngdoc function
 * @name devApp.controller:MessagesCtrl
 * @description
 * # MessagesCtrl
 * Controller of the devApp
 */
angular.module('devApp')
.controller('MessagesCtrl', ['$scope', 'users', 'user', 'them', 'messages', '_', 'messageRepo', 'RESOURCES', '$stateParams', function ($scope, users, user, them, messages, _, messageRepo, RESOURCES, $stateParams) {
  $scope.users = _.indexBy(users, 'id');
  $scope.them = $scope.users[them];
  $scope.RESOURCES = RESOURCES;
  $scope.messageInput = {
    subject: $stateParams.subject //defaults to ""
  };
  $scope.forms = {};

  $scope.sendMessage = function(){
    messageRepo.sendMessage(them, $scope.messageInput.subject, $scope.messageInput.model)
    .then(function(message){
      message.sender = user;
      $scope.messages.push(message); //add it to messages
      $scope.messageInput = {}; //clear the input
      $scope.forms.sendMessageForm.$setPristine();
    });
  };

  var toMe = [], fromMe = [];

  messages.forEach(function(message){
    var sender = message.sender.id,
    receiver = message.receiver.id;

    if (user.id === sender && them === receiver){
      fromMe.push(message);
    }else if(user.id === receiver && them === sender){
      toMe.push(message);
    }
  });

  $scope.messages = toMe.concat(fromMe);

  if ($scope.them.unread){
    messageRepo.markAsRead(toMe).then(function(){
      $scope.them.unread = false;
      var index = _.findIndex(users, 'id', them);
      if( index !== -1) {
       users.splice(index, 1, $scope.them);
      }
    });
  }
}]);
