'use strict';

var Adapter = require('../adapters/adapter');

function parsePlankTimes(input) {
  var commandToken = input.trim().split(' ')[1];

  var regexUsers = /(@?)([a-zA-Z]*)(:?)(\ )*(\d+)/gi
  var regexUser = /(@?)([a-zA-Z]*)(:?)(\ )*(\d+)/i

  var matchedUsers = input.match(regexUsers);
  var usernameGroup = 2;
  var timeGroup = 5;
  var parsedArgs = {};

  for(var i = 0; i < matchedUsers.length; i++) {
    var matchedUser = matchedUsers[i].match(regexUser);
    var username = matchedUser[usernameGroup];
    var plankTime = matchedUser[timeGroup];

    parsedArgs[username] = plankTime;
  };

  return { command: commandToken, args: parsedArgs };
}

class Slack extends Adapter {
  parse(input) {
    if(this.core.type() == 'google') { return parsePlankTimes(input); }
    else if(this.core.type() == 'default') {
      var tokens = input.trim().split(' ');
      return { command: tokens[1], args: tokens.slice(2) }
    }
  }

  render(data) {
    //responseData = JSON.stringify(data);
    return { text: 'SUCCESS!' };
  }
}

module.exports = Slack
