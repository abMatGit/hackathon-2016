var access = require('../..//lib/resource_accessor').access;
var Handler = require('../handler.js');

class Adapter {
  constructor(core) {
    this.core = core;
  }

  parseInput(input) {
    var inputTokens = input.split(' ')

    return {
      command: inputTokens[0],
      args: inputTokens.slice(1)
    };
  }

  invokeCommand(input) {
    // For our adapters, we will end up modifiying 'input.command'
    // for both the cmd and the callback
    var cmd = access(this.core.commands, input.command);
    var callback = access(this.core.callbacks, input.command);
    var handler = new Handler(callback);
    var result = cmd(input.args, handler);

    this.adaptOutput(result);
  }

  adaptOutput(output) {
    return output;
  }
}

module.exports = Adapter;
