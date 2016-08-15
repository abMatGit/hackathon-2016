var assert = require('chai').assert;
var Autobot = require('../main/autobot');

describe('Autobot', function () {
    var autobot = new Autobot('slack');

    it('uses slack adapter and the echo default command', function () {
        autobot.receive('autobot echo wtf', function (err, data) {
            assert.deepEqual(data, { text: ['wtf'] });
        });
    });
});
