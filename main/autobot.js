// Default Commands
var default_commands = {
    'echo': function (input, handler) {
        handler.ok(input.args);
    }
}

// Adapters
var slack = {
    parseInput: function parseInput (input) {
        var inputTokens = input.split(' ');

        return {
            command: inputTokens[0],
            args: inputTokens.slice(1)
        };
    }
};

var Adapters = {
    'slack': slack
};

// Autobot
var Autobot = function (adapter_name, commands) {
    adapter_name = adapter_name || 'slack';
    this.adapter = Adapters[adapter_name];

    if (!this.adapter) {
        throw "No Adapter found";
    }

    this.commands = new Commands(commands || default_commands);
}


// Handler
var Handler = function (callback) {
    if (!callback) {
        callback = callback || function () {};
    }

    this.ok = function (data) {
        callback(null, data);
    };

    this.err = function (err) {
        console.error(err);
        callback(err);
    }
};

// Errors
Autobot.CommandNotFoundError = "Command not found";


Autobot.prototype.process_input = function (inputString, callback) {
    var handler = new Handler(callback);

    try {
        var input = this.adapter.parseInput(inputString);
        var cmd = this.commands.lookup(input.command);

        cmd(input, handler);
    } catch (error) {
        handler.err(error);
    }
};

var Commands = function (cmds) {
    this.commands = cmds;
};

Commands.prototype = {
    lookup: function (cmdName) {
        var cmd = this.commands[cmdName];

        if (!cmd) {
            console.error("Available Commands: ");
            console.error(this.commands);
            throw Autobot.CommandNotFoundError;
        }

        return cmd;
    }
}

module.exports = Autobot;
