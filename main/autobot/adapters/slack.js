'use strict';

var Adapter = require('../adapters/adapter');
class Parser {
  constructor(input) {
    if(input.text) {
      this.input = input.text;
      this.username = input.user_name;
    } else {
      this.input = input;
    }
  }

  parse() {
    if(this.fetchGreeting() != null) {
      return this.fetchGreeting();
    } else if(this.input) {
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
    } else {
      return { command: '', args: {} }
    }
  }

  fetchGreeting() {
    var firstWord = this.input.trim().split(' ')[0];
    var greetingsRegex = /^(greetings|hello|hi|hey|sup)/g

    if(firstWord.match(greetingsRegex) != null) {
      return { command: 'greetings', username: this.username, args: {} }
    }

    return null;
  }

  fetchCommand() {
    return this.input.trim().split(' ')[1];
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
    var matchedUsers = this.input.match(regexUsers).slice(1);

    return { command: 'interpolate', args: matchedUsers };
  }

  parseDefault() {
    return { command: this.fetchCommand(), args: this.input.split(' ').slice(2) }
  }
}

class Slack extends Adapter {
  parse(input) {
    var parser = new Parser(input);
    return parser.parse();
  }

  render(data) {
    //responseData = JSON.stringify(data);
    //console.log(data);
    if(data['totalUpdatedColumns']) {
      if(data['totalUpdatedColumns'] == 2) {
        return { text: 'Successfully updated 1 record!' }
      } else  {
        return { text: 'Sucessfully updated ' + (data['totalUpdatedColumns'] - 1) + ' records!' };
      }
    } else {
      return { text: data }
    }
  }
}

module.exports = Slack
