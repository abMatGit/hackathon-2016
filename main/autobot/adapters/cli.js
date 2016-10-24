'use strict';

var Adapter = require('../adapters/adapter');

class Parser {
  constructor(input) {
    this.input = input;
  }

  parse() {
    if(this.input) {
      var command = this.fetchCommand();

      switch(command) {
        case 'update':
          return this.parseUpdate();
        default:
          return this.parseDefault();
      }
    }
    else {
      return { command: '', args: {} }
    }
  }

  fetchCommand() {
    return this.input.trim().split(' ')[0];
  }

  parseUpdate() {
    var regexUsers = /(@?)([a-zA-Z]*)(:?)(\ )*(\d+)/gi
    var regexUser = /(@?)([a-zA-Z]*)(:?)(\ )*(\d+)/i

    var matchedUsers = this.input.match(regexUsers);
    var usernameGroup = 2;
    var timeGroup = 5;
    var parsedArgs = {};

    for(var i = 0; i < matchedUsers.length; i++) {
      var matchedUser = matchedUsers[i].match(regexUser);
      var username = matchedUser[usernameGroup];
      var plankTime = matchedUser[timeGroup];

      parsedArgs[username] = plankTime;
    };

    return { command: 'update', args: parsedArgs };
  }

  parseDefault() {
    return { command: this.fetchCommand(), args: this.input.split(' ').slice(1) }
  }
}

class Cli extends Adapter {

  /* Right now this parsing is very dumb.
     It is mapping the first word of the console input directly to a core function
     TODO: Implement a regex or some sort of language parser
           for more intelligent mapping.
  */
  parse(input) {
    var parser = new Parser(input)
    return parser.parse();
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
