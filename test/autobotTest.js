var assert = require('chai').assert;
var Autobot = require('../main/autobot');

describe('Autobot', function () {
    context('using slack adapter', function () {
        var autobot = new Autobot('slack');
        var input = { text: 'autobot echo wtf', user_name: 'mang' }

        var failTest = function(data) { assert.equal(1,2); }
        var assertEcho = function(data, error) {
          assert.deepEqual(data, { text: ['wtf'] });
        }

        it('uses slack adapter and the echo default command', function () {
            return autobot.receive(input, assertEcho);
        });
    });

    context('using the cli adapter', function() {
        var autobot = new Autobot('cli');

        var assertEcho = function(data, error) { assert.deepEqual(data, ['wtf']) };

        it('uses the cli adapter and the echo default command', function() {
            return autobot.receive('echo wtf', assertEcho);
        });
    });
});
