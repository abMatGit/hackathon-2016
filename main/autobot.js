var Autobot = function () {
    this.commands = {};
}

Autobot.CommandNotFoundError = "Command not found";

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


function getCommand (autobot, inputData) {
    var cmdFn = autobot.commands[inputData.command];

    if (!cmdFn) {
        throw Autobot.CommandNotFoundError;
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

module.exports = Autobot;
