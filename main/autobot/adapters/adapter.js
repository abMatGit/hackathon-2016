var access  = require('../../lib/resource_accessor').access;
var Handler = require('../handler');

var Adapter = function(core) {
  this.core = core;
}

Adapter.prototype.invokeCommand = function(input, handler) {

    adapter = this;
    var cmd = this.core.commands[input.command];
    if (cmd == undefined) { handler.err("Command not implemented."); }

    cmd(input.args).then(function(data) {
      handler.ok(adapter.adaptOutput(data));
    }).catch(handler.err);
}

Adapter.prototype.parseInput = function(input) {
  var inputTokens = input.split(' ')

  return {
    command: inputTokens[0],
    args: inputTokens.slice(1)
  };
}

Adapter.prototype.adaptOutput = function(data) {
  return data;
}

module.exports = Adapter;
