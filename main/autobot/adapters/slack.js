var Adapter = require('../adapters/adapter');

var Slack = function (core) {
    this.core = core;
}

Slack.prototype = Object.create(Adapter.prototype);

Slack.prototype.adaptOutput = function(output) {
  return { 'text': output };
}

Slack.prototype.parseInput = function(input) {
  // input = autobot getStatus IOS-9999
  var inputTokens = input.split(' ');

  return {
    command: inputTokens[1],
    args: inputTokens.slice(2)
  };
};

module.exports = Slack
