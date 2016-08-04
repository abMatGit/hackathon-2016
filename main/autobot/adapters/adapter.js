var access  = require('../../lib/resource_accessor').access;
var Handler = require('../handler');

var Adapter = function(core) {
  this.core = core;
}

Adapter.prototype.invokeCommand = function(input, autobot_handler) {

    adapter_handler = new Handler(function(err, data) {
      if(err) { autobot_handler.err(err); }
      else { autobot_handler.ok(this.adaptOutput(data)); }
    });

    if (this.core.commands.hasOwnProperty(input.command)) {
        var cmd = this.core.commands[input.command];
        cmd(input.args, adapter_handler);
    } else {
        adapter_handler.err("Command not implemented.");
    }
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
