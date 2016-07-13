var assert = require('chai').assert;

var Autobot = function () {
    this.commands = {};
}

Autobot.prototype.process_input = function (input, outputCallback) {
    var inputTokens = input.split(' ')

    var commandName = inputTokens[0];
    var args = inputTokens.slice(1);

    var command = this.commands[commandName];

    if (command) {
        return outputCallback(null, command(args));
    } else {
        return outputCallback('Command ' + commandName + ' not available.');
    }
};

describe('Autobot', function () {
    var autobot = new Autobot();
    var echoInput = function (args) {
        return args[0];
    };

    it('executes commands via process_input', function (done) {
        autobot.commands.echoInput = echoInput;

        autobot.process_input('echoInput bar', function (err, output) {
            assert.equal(output, 'bar');
            done();
        });
    });

    it('errors when the command isnt setup', function (done) {
        autobot.process_input('test foo', function (err, output) {
            assert.isOk(err);
            done();
        });
    });
});
