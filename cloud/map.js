
var _ = require('underscore');

var favors = {
  mapArray: function(parseObjects){
    return _.map(parseObjects, function(parseObject){
      return favors.mapSingle(parseObject);
    });
  },
  mapSingle: function(parseObject){
    return {
      id: parseObject.id,
      title: parseObject.get('title'),
      user: users.mapSingle(parseObject.get('user'))
    };
  }
};

var users = {
  mapArray: function(parseObjects){
    return _.map(parseObjects, function(parseObject){
      return users.mapSingle(parseObject);
    });
  },
  mapSingle: function(parseObject){
    var user = parseObject;
    return {
      id: user.id,
      picture: user.get("picture"),
      first_name: user.get("first_name"),
      last_name: user.get("last_name"),
      gender: user.get("gender"),
      age: user.get("birthday") ? users.calculateAge(user.get("birthday")) : false,
      bio: user.get("bio"),
      joined: user.createdAt
    };
  },
  calculateAge: function(birthdate) { // birthday is a date
    var birthday = new Date( birthdate.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
};

var messages = {
  mapArray: function(parseObjects){
    return _.map(parseObjects, function(parseObject){
      return messages.mapSingle(parseObject);
    });
  },
  mapSingle: function(parseObject){
    return {
      id: parseObject.id,
      sender: users.mapSingle(parseObject.get('sender')),
      receiver: users.mapSingle(parseObject.get('receiver')),
      subject: parseObject.get('subject'),
      body: parseObject.get('body'),
      date: parseObject.createdAt,
      read: parseObject.get('read')
    };
  }
};

var references = {
  mapArray: function(parseObjects){
    return _.map(parseObjects, function(parseObject){
      return references.mapSingle(parseObject);
    });
  },
  mapSingle: function(parseObject){
    return {
      type: parseObject.get('type'),
      rating: parseObject.get('rating'),
      text: parseObject.get('text'),
      writtenBy: users.mapSingle(parseObject.get('writtenBy')),
      date: parseObject.createdAt
    };
  }
};

var stringToArray = function(title){
  var words = title
    .toLowerCase() //lowercase
    .replace(/[.,-\/#!?'$%\^&\*;:{}=\-_`~()]/g,"") //removes punctuation
    .match(/\S+/g); //splits into an array
  var stopWords = ["a", "an","and","are","as","at","be","by","for","from","has","he","in","is","it","its","of","on","that","the","to","was","were","will","with"];
  return _.difference(words, stopWords);
}

module.exports = {
  favors: favors.mapArray,
  favor: favors.mapSingle,
  users: users.mapArray,
  user: users.mapSingle,
  messages: messages.mapArray,
  message: messages.mapSingle,
  references: references.mapArray,
  reference: references.mapSingle,
  stringToArray: stringToArray
};
