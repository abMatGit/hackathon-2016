const repl = require('repl');

repl.start({
    prompt: 'autobot > ',
    eval: evalAutobot
});

var Autobot = require('../autobot');
var dudeBot = new Autobot('cli');

function evalAutobot(cmd, context, filename, callback) {
    dudeBot.process_input(cmd, callback);
}
