var _ = require('underscore');

function sendEmail(to, subject, html){
  var sendgrid = require("sendgrid");
  sendgrid.initialize("USER", "PASSWORD"); //replace with actual credentials
  html += ' If you want to stop receiving these notifications, update your settings here: <a href="http://www.favor.trade/#/me/settings">http://www.favor.trade/#/me/settings</a>.';

  return sendgrid.sendEmail({
    to: to,
    from: "info@favor.trade",
    subject: subject,
    html: html
  });
}

Parse.Cloud.afterSave("Messages", function(request) {
  if(!request.master){ //if it's not cloud code
    var receiver = request.object.get("receiver");
    var sender = request.object.get("sender");

    Parse.Cloud.useMasterKey(); //required to query user, which is otherwise private
    Parse.Promise.when(sender.fetch(), receiver.fetch()).then(function(senderFetched, receiverFetched){
      if(receiverFetched.get("emailWhenMessaged")){
        var subjectTemplate = _.template("You have a new message from <%= sender_first %> <%= sender_last %> on Favor.trade!");
        var bodyTemplate = _.template('You have a new message from <%= sender %>! It says: <br/><br/><i>"<%= message %>"</i><br/><br/>Visit <a href="http://www.favor.trade/#/messages/<%= senderid %>">http://www.favor.trade/#/messages/<%= senderid %></a> to reply.')

        var emailAddress = receiverFetched.get("email"),
        subject = subjectTemplate({sender_first: senderFetched.get("first_name"), sender_last: senderFetched.get("last_name")});
        html = bodyTemplate({sender: senderFetched.get("first_name"), message: request.object.get("body"), senderid: senderFetched.id});

        return sendEmail(emailAddress, subject, html);
      }else{
        return Parse.Promise.as("email disabled");
      }
    });
  }
});

Parse.Cloud.afterSave("References", function(request) {
  var about = request.object.get("about");
  var writtenBy = request.object.get("writtenBy");

  Parse.Cloud.useMasterKey(); //required to query user, which is otherwise private
  Parse.Promise.when(about.fetch(), writtenBy.fetch()).then(function(aboutFetched, writtenByFetched){
    if(aboutFetched.get("emailWhenReferenced")){
      var subjectTemplate = _.template("<%= writtenBy_first %> <%= writtenBy_last %> left you a reference on Favor.trade!");
      var bodyTemplate = _.template('You have a new reference from <%= writtenBy_first %>! Visit <a href="http://www.favor.trade/#/people/<%= about_id %>">http://www.favor.trade/#/people/<%= about_id %></a> to read it.')

      var emailAddress = aboutFetched.get("email");
      subject = subjectTemplate({writtenBy_first: writtenByFetched.get("first_name"), writtenBy_last: writtenByFetched.get("last_name")});
      html = bodyTemplate({writtenBy_first: writtenByFetched.get("first_name"), about_id: aboutFetched.id});

      return sendEmail(emailAddress,subject, html);
    }else{
      return Parse.Promise.as("email disabled");
    }
  });
});
