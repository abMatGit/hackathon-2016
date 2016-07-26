var Slack = function (core) {
    this.core = core;
}

// HACKETY HACK WTF
Slack.prototype = require('../adapters/adapter').prototype;

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
