'use strict';

/**
 * @ngdoc service
 * @name devApp.messageRepo
 * @description
 * # messageRepo
 * Factory in the devApp.
 */
angular.module('devApp')
  .factory('messageRepo', ['_', 'Parse' , 'auth', '$interval', '$timeout', '$rootScope', function (_, Parse, auth, $interval, $timeout, $rootScope) {
    var Messages = Parse.Object.extend("Messages"),
    cache = {};

    // Public API here
    var messageRepo =  {
      getMessages: function(){
        return Parse.Cloud.run("getMessages");
      },
      getUnreadCount: function(){
        var query = new Parse.Query(Messages);
        query.equalTo("receiver", auth.getUser());
        query.equalTo("read", false);

        if (!cache.getUnreadCount){
          //update cache
          cache.getUnreadCount = query.count();
        }
        return cache.getUnreadCount;
      },
      markAsRead: function(messages){
        return Parse.Cloud.run("markAsRead", {
          messages: messages
        })
        .then(function(){
          clearCache('getUnreadCount');

          $timeout(function(){
            $rootScope.$broadcast('newMessage');
          },2000); //make the badge icon linger for a second
        });
      },
      mapMessages: function(parseObjects){
        return _.map(parseObjects, function(parseObject){
          return messageRepo.mapMessage(parseObject);
        });
      },
      mapMessage: function(parseObject){
        return {
          obj: parseObject,
          sender: parseObject.get('sender'),
          receiver: parseObject.get('receiver'),
          subject: parseObject.get('subject'),
          body: parseObject.get('body'),
          date: parseObject.createdAt,
          read: parseObject.get('read')
        };
      },
      sendMessageFromFavor: function (favor) {
        var to = favor.user.id;
        var subject = "Request: " + favor.title;
        var body = favor.message;

        return messageRepo.sendMessage(to, subject, body);
      },
      sendMessage: function(to, subject, body){
        var message = new Messages();

        var User = Parse.Object.extend("_User");
        var receiver = new User();
        receiver.id = to;

        //message.set("sender", user); //set in cloudcode
        message.set("receiver", receiver);
        message.set("subject", subject);
        message.set("body", body);
        return message.save().then(messageRepo.mapMessage);
      }
    };

    function clearCache(key){
      if(key){
        cache[key] = null;
      }else{
        cache = {};
      }
    }

    function clearAllCache(){ //arg is automatically passed by $interval
      clearCache();
    }

    //clear message cache every 30 seconds
    $interval(clearAllCache, 30 * 1000);
    $rootScope.$on('logout', clearAllCache);


    return messageRepo;
  }]);
