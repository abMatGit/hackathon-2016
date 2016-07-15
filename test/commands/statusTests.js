var assert = require('chai').assert;
var Autobot = require('../../main/autobot');

var statusCommand = function (input, handler) {
    if (input.args[0]) {
        // use specific story
    }

    // use all stories
    handler.success('no');
};

describe('Status Command', function () {
    it('display everything if no story is passed in', function() {
        var autobot = new Autobot();

        autobot.commands.status = statusCommand;
        autobot.process_input('status im retarded?', function (err, output) {
            assert.equal(output, 'no');
        });
    });
});
