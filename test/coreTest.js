var chai = require('chai');
var assert = chai.assert;

var Core = require('../main/autobot/core/core').Core;

describe('Core', function() {
    var testCommands = {
        helloWorld: function (args) { return 'Hello World ' + args; }
    };
    var resource = {};
    var core = new Core(testCommands, resource);

    describe('#process', function() {
        var inputTokens = { command: 'helloWorld', args: 'foobar' };
        var subject = core.process(inputTokens);

        it('utilizes commands from constructor to invoke with input tokens', function() {
            var expectedResult = 'Hello World foobar';
            assert.equal(subject, expectedResult);
        });
    });
});

describe('Default Core', function() {
    var defaultCore = require('../main/autobot/core/core').default;

    describe('#commands', function() {
        it('has an echo interface', function() {
            assert.property(defaultCore.commands, 'echo');
        });

        it('has an get interface', function() {
            assert.property(defaultCore.commands, 'get');
        });
    });
});
