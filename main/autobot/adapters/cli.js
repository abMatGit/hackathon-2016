'use strict';

var Adapter = require('../adapters/adapter');

class Parser {
  constructor(input) {
    this.input = input;
    this.commandIndex = 0;
    this.argsIndex = 1;
  }

  parse() {
    if(this.input) {
      var command = this.fetchCommand();

      switch(command) {
        case 'update':
          return this.parseUpdate();
        case 'chart':
          return this.parseChart();
        case 'interpolate':
          return this.parseInterpolate();
        default:
          return this.parseDefault();
      }
    }
    else {
      return { command: '', args: {} }
    }
  }

  fetchCommand() {
    return this.input.trim().split(' ')[this.commandIndex];
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

  parseChart() {
    var regexUsers = /[a-zA-z]+/gi
    var matchedUsers = this.input.match(regexUsers);

    return { command: 'chart', args: matchedUsers };
  }

  parseInterpolate() {
    var regexUsers = /([a-zA-z]+)/gi
    var matchedUsers = this.input.match(regexUsers).slice(this.argsIndex);

    return { command: 'interpolate', args: matchedUsers };
  }

  parseDefault() {
    var command = this.fetchCommand();
    var args = this.input.split(' ').slice(this.argsIndex);
    return { command: command, args: args }
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
