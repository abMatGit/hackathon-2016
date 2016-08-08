var Handler = require('./autobot/handler');
var access = require('./lib/resource_accessor').access;
var core = require('./autobot/core/core');
var Adapters = require('./autobot/adapters');

var Autobot = function (adapter_name) {
    switch (adapter_name) {
        case 'slack':
            this.adapter = new Adapters.Slack(core);
            break;
        case 'cli':
            this.adapter = new Adapters.Cli(core);
            break;
        default:
            this.adapter = new Adapters.Cli(core);
    }
}

// #process_input
Autobot.prototype.process_input = function (inputString, callback) {
    var handler = new Handler(callback);

    try {
        var input = this.adapter.parseInput(inputString);
        this.adapter.invokeCommand(input, handler);

    } catch (error) {
        // Fail on the bot
        handler.err(error);
    }
};

module.exports = Autobot;
