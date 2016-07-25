var Adapter = require('./adapter');

var Slack = Adapter;

Slack.prototype.adaptOutput = function(output) {
  return { 'text': output };
}

Slack.prototype.parseInput = function(input) {
  var inputTokens = input.split(' ');
  console.log(inputTokens);

  return {
    command: inputTokens[1],
    args: inputTokens.slice(2)
  };
};

module.exports = Slack
