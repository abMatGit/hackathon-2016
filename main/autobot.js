var Handler = require('./autobot/handler.js');
var access = require('./lib/resource_accessor.js').access;
var core = require('./autobot/core/core.js');
var Slack = require('./autobot/adapters/slack.js');

// Adapters : Still a fresh idea since autobot can use many different adapters.
var Adapters = {
    'slack': new Slack(core)
};

// Autobot finally !
var Autobot = function (adapter_name) {
    this.adapter = access(Adapters, adapter_name || 'slack');
}

// #process_input
Autobot.prototype.process_input = function (inputString, callback) {
    var handler = new Handler(callback, this.adapter);

    try {
        var input = this.adapter.parseInput(inputString);
        this.adapter.invokeCommand(input, handler);
    } catch (error) {
        // Fail on the bot
        handler.err(error);
        // Fail as a program
        throw error;
    }
};

module.exports = Autobot;
