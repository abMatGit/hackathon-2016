var assert = require('chai').assert;
var Autobot = require('../main/autobot');

class ResourceBot extends Autobot {
};

describe('ResourceBot', function() {
    var data = { hello: 'world' };

    var getInfo = function(input, handler) {
        data_field = input.args[0]
        handler.ok(data[data_field]);
    };

    var resource = new ResourceBot('slack', { 'getInfo': getInfo });

    xit('uses the resource to initialize the resource bot', function() {
        assert.equal(data, resource.extra);
    });

    it('uses callbacks similarly to autobot', function() {
        resource.process_input('getInfo hello', function (err, output) {
            assert.equal(err, null);
            assert.equal(output, 'world');
        });
    });
});
