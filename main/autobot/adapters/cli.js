'use strict';

var Adapter = require('../adapters/adapter');

function parsePlankTimes(input) {
  var commandToken = input.trim().split(' ')[0];

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

class Cli extends Adapter {

  /* Right now this parsing is very dumb.
     It is mapping the first word of the console input directly to a core function
     TODO: Implement a regex or some sort of language parser
           for more intelligent mapping.
  */
  parse(input) {
    return parsePlankTimes(input);
    /*
    var tokens = input.trim().split(' ');
    return { command: tokens[0], args: tokens.slice(1) }
    */
  }


  /*
    TODO: Have an object whose responsibility it is to render
          this data depending on what kind of data it is?
  */
  render(data) {
    return data;
  }
}

module.exports = Cli
