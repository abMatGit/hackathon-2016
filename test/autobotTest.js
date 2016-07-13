var assert = require('chai').assert;

var Autobot = require('autobot');

function parse(input) {
    // tokenizer
}

var parsedResult = parser('ma nigga');
// tokenizer?
//

parsedResult.command // status
parsedResult.args // [IOS-1234, IOS-1324]

Autobot.prototype.read_line = function (input) {
    var adapter = new CLIAdapter();

    parse(adapter.makeCommandParsable(input));
}

describe('parser', function () {
    context('input', function () {
        var autobot = new Autobot();

        var result = autobot.parse('botname brew coffee');
        assert(result.command).equal('brew');
        assert(result.args).deepEqual(['coffee']);
    });
});


derscribe('get cli commands into parser', function() {
    var cliAdapter = new CLIAdapater();
    var inputFromCLI = ['brew', ['coffee', 'coffee2']];
    var parserableOutput = 'botname brew coffee';

    assert(cliAdapter.makeCommandParsable('brew', ['coffee', 'black coffee'])).equal('botname brew coffee');
}
