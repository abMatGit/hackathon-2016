var Adapter = require('./adapter');

var Slack = Adapter;

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
