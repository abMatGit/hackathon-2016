class Autobot {
    constructor(extra = {}) {
      this.commands = {};
      this.extra = extra;
    }
}

Autobot.CommandNotFoundError = "Command not found";
Autobot.CallbackNotDefined   = "Callback not defined";
Autobot.InvalidInput         = function (input) { return "Invalid input: " + input; };

Autobot.prototype.process_input = function (inputString, callback) {
    if (!callback) {
        throw Autobot.CallbackNotDefined;
    }

    var resultHandler = {
        // Shim that will let us forget about passing null in sucessful cases.
        success: function (data) { callback(null, data); },
        fail: function (err) { callback(err); }
    };

    try {
        var input = inputParser(this, inputString);
        var cmd = getCommand(this, input);

        cmd(input, this.extra, resultHandler);
    } catch (error) {
        resultHandler.fail(error);
    }
};


function getCommand (autobot, input) {
    var cmdFn = autobot.commands[input.command];

    if (!cmdFn) {
        throw Autobot.CommandNotFoundError;
    }

    return cmdFn;
}

function inputParser (autobot, input) {
    if(!input) {
      throw Autobot.InvalidInput('"' + input + '"');
    }

    var inputTokens = input.split(' ');
    var commandToken = inputTokens[0];

    return {
        command: commandToken,
        args: inputTokens.slice(1)
    };
}

module.exports = Autobot;
