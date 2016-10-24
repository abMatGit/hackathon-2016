const repl = require('repl');

repl.start({
    prompt: 'autobot > ',
    eval: evalAutobot
});

var Autobot = require('../autobot');
var dudeBot = new Autobot('cli', 'google');

function evalAutobot(input, context, filename, callback) {
    dudeBot.receive(input).then(callback);
}
