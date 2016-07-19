var assert = require('chai').assert;
var Autobot = require('../../main/autobot');

describe('Status Command', function () {
    it('display everything if no story is passed in', function() {
        var autobot = new Autobot();

        autobot.process_input('status im retarded?', function (err, output) {
            assert.equal(output, 'no');
        });
    });
});
