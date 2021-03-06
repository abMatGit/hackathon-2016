'use strict';

var Adapter = require('../adapters/adapter');

class Slack extends Adapter {
  parse(input) {
    var tokens = input.split(' ');
    return { command: tokens[1], args: tokens.slice(2) }
  }

  render(data) {
    return { text: JSON.stringify(data) };
  }
}

module.exports = Slack
