var assert = require('chai').assert;

var Autobot = function () {
    this.commands = {};
    this.printer = function (output) {
        return output;
    }
}

Autobot.prototype.process_input = function (input, outputCallback) {
    var inputTokens = input.split(' ')

    var commandName = inputTokens[0];
    var args = inputTokens.slice(1);

    var command = this.commands[commandName];

    if (command) {
        return outputCallback(null, this.printer(command(args)));
    } else {
        return outputCallback('error');
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

    it('can use different printers', function (done) {
        autobot.printer = function (output) {
            return output.replace("🍎", ":apple:");
        };

        autobot.commands.emoji = function(args) {
            return "🍎";
        }

        autobot.process_input('emoji apple', function (err, output) {
            assert.equal(output, ":apple:");
            done();
        });
    });
});
