var assert = require('chai').assert;

var Autobot = function () {
    this.commands = {};
}

Autobot.prototype.process_input = function (inputString, outputCallback) {
    var input = this.inputParser(inputString);

    var command = this.commands[input.command];

    if (command) {
        return outputCallback(null, command(input.args));
    } else {
        return outputCallback('Command ' + commandName + ' not available.');
    }
};

Autobot.prototype.inputParser =

    var clieInputParser = function (input) {
    }

    var inputTokens = input.split(' ')

    return {
        command: inputTokens[0]
        args: inputTokens.slice(1)
    }
}

var slackWebHookPerser = function (input) {
    var inputTokens = input.split(' ')

    return {
        command: inputTokens[0]
        args: inputTokens.slice(1)
    }
}

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

    it('returns an error when the command isnt found', function (done) {
        autobot.process_input('test foo', function (err, output) {
            assert.isOk(err);
            done();
        });
    });
});
