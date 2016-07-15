var assert = require('chai').assert;

var Autobot = function () {
    this.commands = {};
}

Autobot.prototype.process_input = function (inputString, callback) {
    if (!callback) {
        callback = callback || function () {};
    }

    var resultHandler = {
        // Shim that will let us forget about passing null in sucessful cases.
        success: function (data) { callback(null, data); },
        fail: function (err) { callback(err); }
    };

    try {
        var input = inputParser(inputString);
        var cmd = getCommand(this, input);

        cmd(input, resultHandler);
    } catch (error) {
        resultHandler.fail(error);
    }
};


function getCommand (inputData) {
    let cmdFn = this.commands[inputData.command];

    if (!cmdFn) {
        throw "Wtf mang";
    }

    return cmdFn;
}

function inputParser (input) {
    var inputTokens = input.split(' ');

    return {
        command: inputTokens[0],
        args: inputTokens.slice(1)
    };
}

describe('Autobot', function () {
    var autobot = new Autobot();
    var echoInput = function (args) {
        return args[0];
    };

    it('uses a callback to pass data', function () {
        autobot.commands.echoInput = echoInput;

        autobot.process_input('', function(err, output) {
            assert(err);
        })
    });
});
