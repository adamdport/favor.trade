var _ = require('underscore');
var map = require('cloud/map.js');


Parse.Cloud.beforeSave("Favors", function(request, response) {
  if(request.master){ //if using the master key, must be cloud code
    response.success();
  }else{
    if((request.object.get("user").id !== request.user.id) //If not the owner
      && (request.object.dirty("user") || request.object.dirty("title"))){ //and they're trying to modify the favor
      response.error("You cannot modify someone else's Favor.");
    } else if(request.object.dirty("banned")){ //unset check?
      response.error("Cannot unban a favor.");
    } else if (request.object.get("title").length > 200) {
      response.error("Favors must be less than 200 characters.");
    } else if (request.object.get("title").length < 3) {
      response.error("Favors must be at least 3 characters.");
    }else{
      var favorCap;
      if(!request.object.id){ //if it's new
        var query = new Parse.Query("Favors");
        query.equalTo("user", request.user);
        favorCap = query.count().then(function(count){
          if(count >= 20){
            return Parse.Promise.error("You cannot add more than 20 favors.")
          }else{
            return Parse.Promise.as();
          }
        });
      }else{
        favorCap = Parse.Promise.as();
      }

      favorCap.then(function(){
        request.object.set("searchable", map.stringToArray(request.object.get("title")));
      }).then(response.success, response.error);
    }
  }
});

Parse.Cloud.beforeSave("Messages", function(request, response) {
  var body = request.object.get("body");
  if (body.length > 500) {
    response.error("Messages must be less than 500 characters.");
  }

  var subject = request.object.get("subject");
  if (subject && subject.length > 140) {
    // Truncate and add a ...
    request.object.set("subject", subject.substring(0, 137) + "...");
  }

  if(!request.master){ //if it's not cloud code
    request.object.set("read", false);
    request.object.set("sender", request.user); //Refactor when parse fixes bug
  }

  response.success();
});

Parse.Cloud.beforeSave("References", function(request, response) {
  if (['friends','doer','receiver'].indexOf(request.object.get("type")) === -1) {
    response.error("Invalid reference type");
  } else if ([-1,0,1].indexOf(request.object.get("rating")) === -1){
    response.error("Invalid rating value");
  } else if (request.object.get("text").length > 200){
    response.error("References must be less than 200 characters.");
  } else if (request.object.get("text").length < 10){
    response.error("References must be at least 10 characters.");
  }else {
    response.success();
  }
});

Parse.Cloud.beforeSave("Flags", function(request, response) {
  request.object.set("flagger", request.user); //Refactor when parse fixes bug
  response.success();
});

Parse.Cloud.beforeDelete(Parse.User, function(request, response) {
  var promises = [];
  Parse.Cloud.useMasterKey();

  //delete Favors
  console.log('deleting favors for user ' + request.object.id);
  var favors = new Parse.Query("Favors");
  favors.equalTo("user", request.object);
  //promises.push(favors.find().then(Parse.Object.destroyAll));
  promises.push(favors.find().then(function(favs){
    console.log('destroying ' + favs.length + ' favors');
    return Parse.Object.destroyAll(favs); //for some reason I can't pass this in then...
  }));


  //delete Messages
  console.log('deleting messages for user ' + request.object.id);
  var senderQuery = new Parse.Query("Messages");
  senderQuery.equalTo("sender", request.object);
  var receiverQuery = new Parse.Query("Messages");
  receiverQuery.equalTo("receiver", request.object);
  var messages = Parse.Query.or(senderQuery, receiverQuery);
  promises.push(messages.each(function(m){ //need .each in case there are more than 1000 messages
    console.log("deleting message: " + m.id);
    return m.destroy();
  }));

  //delete References
  console.log('deleting references for user ' + request.object.id);
  var referencesByUser = new Parse.Query("References");
  referencesByUser.equalTo("writtenBy", request.object);
  var referencesForUser = new Parse.Query("References");
  referencesForUser.equalTo("about", request.object);
  var references = Parse.Query.or(referencesByUser, referencesForUser);
  //promises.push(references.find().then(Parse.Object.destroyAll));

  promises.push(references.each(function(ref){
    console.log("deleting reference: " + ref.id);
    return ref.destroy();
  }));

  Parse.Promise.when(promises).then(response.success, response.error);
});
