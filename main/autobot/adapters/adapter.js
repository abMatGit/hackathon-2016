var access = require('../..//lib/resource_accessor').access;

var Adapter = function(core) {
  this.core = core;
}

Adapter.prototype.invokeCommand = function(input, handler) {
  var cmd = access(this.core.commands, input.command);
  cmd(input.args, handler);
}

Adapter.prototype.parseInput = function(input) {
  var inputTokens = input.split(' ')

  return {
    command: inputTokens[0],
    args: inputTokens.slice(1)
  };
}

Adapter.prototype.adaptOutput = function(output) {
  return output;
}

module.exports = Adapter;
