var assert = require('chai').assert;

var AdapterA = function() {
  this.commands = {
      echo: function (args) {
          return "Adapter A: " + args[0];
      }
  }
}

var AdapterB = function() {
  this.commands = {
      echo: function (args) {
          return "Adapter B: " + args[0];
      }
  }
}

var Autobot = function(adapter) {
    this.adapter = adapter;
}

Autobot.prototype.process = function(input, outputCallback) {
    var inputTokens = input.split(' ')

    var commandName = inputTokens[0];
    var args = inputTokens.slice(1);

    var command = this.adapter.commands[commandName];

    if (command) {
        return outputCallback(null, command(args));
    } else {
        return outputCallback('Command ' + commandName + ' not available.');
    }
};

describe('Autobot', function () {
    var adapterA = new AdapterA();
    var adapterB = new AdapterB();

    it('executes commands via the adapter', function (done) {
        var autobot = new Autobot(adapterA);
        autobot.process('echo bar', function (err, output) {
            assert.equal(output, 'Adapter A: bar');
        });

        autobot = new Autobot(adapterB);
        autobot.process('echo bar', function (err, output) {
            assert.equal(output, 'Adapter B: bar');
            done();
        });
    });

    it('errors when the command isnt setup', function (done) {
        var autobot = new Autobot(adapterA);
        autobot.process('test foo', function (err, output) {
            assert.isOk(err);
            done();
        });
    });
});
