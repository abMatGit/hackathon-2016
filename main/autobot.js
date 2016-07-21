var Handler = require('./autobot/handler.js');
var access = require('./lib/resource_accessor.js').access;

// Default set of commands
var default_commands = {
    'echo': function (input, handler) {
        handler.ok(input.args);
    }
}

// Adapters : Still a fresh idea since autobot can use many different adapters.
var Adapters = {
    'slack': {
        parseInput: function parseInput (input) {
            var inputTokens = input.split(' ');

            return {
                command: inputTokens[0],
                args: inputTokens.slice(1)
            };
        }
    }
};

// Autobot finally !
var Autobot = function (adapter_name, commands) {
    this.adapter = access(Adapters, adapter_name || 'slack');
    this.commands = commands || default_commands;
}

// #process_input
Autobot.prototype.process_input = function (inputString, callback) {
    var handler = new Handler(callback);

    try {
        var input = this.adapter.parseInput(inputString);
        var cmd = access(this.commands, input.command);

        cmd(input, handler);
    } catch (error) {
        // Fail on the bot
        handler.err(error);

        // Fail as a program
        throw error;
    }
};

// #process_output
Autobot.prototype.process_output = function(outputString) {

};

module.exports = Autobot;
