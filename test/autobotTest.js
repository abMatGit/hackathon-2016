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
    var help = function() {
        help_message = 'List of supported commands:\n'
        help_message += Object.keys(autobot.commands).join('\n');
        return help_message;
    }

    it('has a help page for available commands', function (done) {
        autobot.commands.echoInput = echoInput;
        autobot.commands.help = help;

        var expected_output = 'List of supported commands:\nechoInput\nhelp';

        autobot.process_input('help', function (err, output) {
            assert.equal(output, expected_output);
            done();
        });
    });

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
