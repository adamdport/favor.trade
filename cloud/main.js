
var validation = require('cloud/validation.js');
var map = require('cloud/map.js');
var email = require('cloud/email.js');
var _ = require('underscore');


// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("getFavorsByLocation", function(request, response) {
  //requireUser(request, response);
  Parse.Cloud.useMasterKey(); //required to query user location, which is otherwise private
  var query = new Parse.Query("Favors");
  var location = request.user ? request.user.get("location") : request.params.location;

  if(request.params.units === "kilometers"){
    query.withinKilometers("location", location, request.params.distance);
  }else{
    query.withinMiles("location", location, request.params.distance);
  }

  if(request.user){
    query.include("user"); //include user info
    query.notEqualTo("user", request.user); //that don't belong to the current user
    query.notEqualTo("flaggedBy", request.user);  //that have NOT been flagged by the current user
  }
  if(request.params.search){
    query.containsAll("searchable", map.stringToArray(request.params.search));
  }
  query.doesNotExist("banned");  //and has not been banned (flagged by lots of users)
  query.limit(50);
  query.skip(request.params.skip || 0);

  query.find().then(map.favors).then(response.success, response.error);
});

Parse.Cloud.define("indexFavors", function(request, response){
  Parse.Cloud.useMasterKey(); //required to query user location, which is otherwise private
  var query = new Parse.Query("Favors");
  query.each(function(favor){
    favor.set("searchable", map.stringToArray(favor.get("title")));
    return favor.save();
  }).then(response.success, response.error);
})

Parse.Cloud.define("getFavorsByUser", function(request, response) {
  requireUser(request, response);
  Parse.Cloud.useMasterKey(); //required to query user location, which is otherwise private

  var User = Parse.Object.extend("_User");
  var user = new User();
  user.id = request.params.userid;

  var query = new Parse.Query("Favors");
  query.equalTo("user", user); //that don't belong to the current user
  query.notEqualTo("flaggedBy", request.user);  //that have NOT been flagged by the current user
  query.doesNotExist("banned");  //and has not been banned (flagged by lots of users)
  query.limit(50);

  query.find().then(map.favors).then(response.success, response.error);
});

Parse.Cloud.define("getUsersByLocation", function(request, response){
  if (request.params.distance > 100){
    response.error("You may not specify a distance greater than 100");
    return;
  }

  var query = new Parse.Query(Parse.User);
  var user = request.user;
  if(request.params.units === "kilometers"){
    query.withinKilometers("location", user.get("location"), request.params.distance);
  }else{
    query.withinMiles("location", user.get("location"), request.params.distance);
  }
  query.notEqualTo("objectId", user.id);
  query.skip(request.params.skip || 0);  requireUser(request, response);
  Parse.Cloud.useMasterKey(); //required to query other users

  query.find().then(map.users).then(response.success, response.error);
});

Parse.Cloud.define("getUserById", function(request, response){
  query = new Parse.Query(Parse.User);
  query.equalTo("objectId", request.params.userid);

  requireUser(request, response);
  Parse.Cloud.useMasterKey(); //required to query other users

  query.first().then(function(results){
    if (!results){
      return Parse.Promise.error("User not found");
    }else{
      return Parse.Promise.as(results);
    }
  }).then(map.user).then(response.success, response.error);;
});

Parse.Cloud.define("saveReference", function(request, response) {
  requireUser(request, response);
  Parse.Cloud.useMasterKey(); //write permissions on references are disabled so users can't save more than 1

  var User = Parse.Object.extend("_User");
  var about = new User();
  about.id = request.params.userid;

  var query = new Parse.Query("References");
  query.equalTo("about", about);
  query.equalTo("writtenBy", request.user);
  query.find().then(function(references){
    if (references.length){
      return Parse.Promise.error("You have already written a reference for this person.");
    }else{
      var References = Parse.Object.extend("References");
      var reference = new References();
      reference.set('about', about);
      reference.set('writtenBy', request.user);
      reference.set('text', request.params.text);
      reference.set('type', request.params.type);
      reference.set('rating', request.params.rating);

      return reference.save();
    }
  }).then(response.success, response.error);
});

Parse.Cloud.define("flagFavor", function(request, response) {
  requireUser(request, response);
  Parse.Cloud.useMasterKey(); //write permissions on favors are disabled if they belong to other users

  var Favors = Parse.Object.extend("Favors");
  var favor = new Favors({id: request.params.id});
  favor.addUnique("flaggedBy", request.user);

  favor.save().then(function(favor){
    if (favor.get("flaggedBy").length > 5){
      var date = new Date();
      favor.set("banned", date);
      return favor.save();
    }else{
      return Parse.Promise.as("flag saved");
    }
  }).then(response.success, response.error);
});

Parse.Cloud.define("getMessages", function(request, response) {
  Parse.Cloud.useMasterKey(); //required to query user location, which is otherwise private

  var senderQuery = new Parse.Query("Messages");
  senderQuery.equalTo("sender", request.user);

  var receiverQuery = new Parse.Query("Messages");
  receiverQuery.equalTo("receiver", request.user);

  var query = Parse.Query.or(senderQuery, receiverQuery);
  query.descending("createdAt");
  query.include("sender");
  query.include("receiver");
  query.limit(500);
  query.skip(request.params.skip ? request.params.skip : 0);
  query.find().then(map.messages).then(response.success, response.error);
});

Parse.Cloud.define("markAsRead", function(request, response) {
  Parse.Cloud.useMasterKey();
  var messageArray = [];
  var Messages = Parse.Object.extend("Messages");

  request.params.messages.forEach(function(message){
    var obj = new Messages({id: message.id});
    obj.set("read", true);
    messageArray.push(obj);
  });
  Parse.Object.saveAll(messageArray).then(response.success, response.error);
});

Parse.Cloud.define("getReferences", function(request, response) {
  var query = new Parse.Query("References");
  var User = Parse.Object.extend("_User");
  var about = new User();
  about.id = request.params.userid;
  query.equalTo("about", about);
  query.include("writtenBy");

  requireUser(request, response);
  Parse.Cloud.useMasterKey(); //write permissions on favors are disabled if they belong to other users

  query.find().then(map.references).then(response.success, response.error);
});

function requireUser(request, response){
  if (!request.user){
    response.error("login required.");
  }
}
