function Autobot () {};

Autobot.prototype.read_input = function (input, callback) {
    if (!input) {
        callback("no input");
        return;
    }

    var words = input.split(' ');

    callback(null, {
        command: words[0],
        args: words.slice(1)
    });
};

var assert = require('chai').assert;

describe('Autobot', function () {
    it('read_input', function(done) {
        var autobot = new Autobot();

        autobot.read_input('hello muchacho', function (err, input) {
            assert.equal(input.command, 'hello');
            assert.deepEqual(input.args, ['muchacho']);
            done();
        });
    });
});
