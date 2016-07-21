var access = require('../..//lib/resource_accessor').access;

class Adapter {
  constructor(core) {
    this.commands = core.commands;
  }

  parseInput(input) {
    var inputTokens = input.split(' ')

    return {
      command: inputTokens[0],
      args: inputTokens.slice(1)
    };
  }

  invokeCommand(input, handler) {
    var cmd = access(this.commands, input.command);
    cmd(input, handler);
  }

  adaptOutput(output) {
    return output;
  }
}

module.exports = Adapter;
