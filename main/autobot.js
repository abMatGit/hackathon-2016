var default_commands = {
    'echo': function (input, handler) {
        handler.ok(input.args);
    }
}


var Adapter = Object.new();

var Slack = Object.new(Adapter);

var Adapters = {
    'slack': {
        readEvent: function (event, context) {
            var body = event.body;
            var params = qs.parse(body);
            var requestToken = params.token;
        }
    }
};

var Autobot = function (adapter_name, args) {
    this.adapter = Adapater(adapter_name);
    if (!this.adapter) {
        throw "No Adapter found";
    }

    this.commands = new Commands(default_commands);
}

var Handler = function (callback) {
    if (!callback) {
        callback = callback || function () {};
    }

    this.ok = function (data) {
        callback(null, data);
    };

    this.err = function (err) {
        callback(err);
    }
};


Autobot.CommandNotFoundError = "Command not found";

Autobot.prototype.process_input = function (inputString, callback) {
    var handler = new Handler(callback);

    try {
        var input = parseInput(inputString);
        var cmd = this.getCommand(input);

        cmd(input, handler);
    } catch (error) {
        handler.err(error);
    }
};


var Commands = function (cmds) {
    this.commands = cmds;

    this.lookup = function (cmdName) {
        var cmd = this.commands[cmdName];

        if (!cmd) {
            throw Autobot.CommandNotFoundError;
        }
    }
}

Autobot.prototype.getCommand = function (inputData) {
    return this.commands.lookup(inputData.command);
}

function parseInput (input) {
    var inputTokens = input.split(' ');

    return {
        command: inputTokens[0],
        args: inputTokens.slice(1)
    };
}

module.exports = Autobot;
