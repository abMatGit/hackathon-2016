var access = require('../..//lib/resource_accessor').access;
var Handler = require('../handler.js');

var Adapter = function(core) {
  this.core = core;

  this.invokeCommand = function(input, handler) {
    console.log("invoke command input: " + input);
    // For our adapters, we will end up modifiying 'input.command'
    // for both the cmd and the callback
    var cmd = access(this.core.commands, input.command);
    cmd(input.args, handler);
  }
}
Adapter.prototype.parseInput = function(input) {
  var inputTokens = input.split(' ')

  return {
    command: inputTokens[0],
    args: inputTokens.slice(1)
  };
};

Adapter.prototype.adaptOutput = function(output) {
  return output;
}

module.exports = Adapter;
