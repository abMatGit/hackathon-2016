var access  = require('../../lib/resource_accessor').access;
var Handler = require('../handler');

var Parser = function () {
  this.parseInput = function(input) {
    var inputTokens = input.split(' ')

    return {
      command: inputTokens[0],
      args: inputTokens.slice(1)
    };
  }
}

var Drawer = function() {
  this.draw = function(command, data) {};
}

var Adapter = function(core) {
  this.core = core;
  this.parser = new Parser();
  this.drawer = new Drawer();
}

Adapter.prototype.invokeCommand = function(input, handler) {
    adapter = this;
    var cmd = this.core.commands[input.command];
    if (cmd == undefined) { handler.err("Command not implemented."); }

    cmd(input.args).then(function(data) {
      adapter.adaptOutput(input.command, data)
      handler.ok('finished');
    }).catch(handler.err);
}

Adapter.prototype.parseInput = function(input) {
  return this.parser.parseInput(input);
};

Adapter.prototype.adaptOutput = function(command, data) {
  return this.drawer.draw(command, data);
}

module.exports = Adapter;
