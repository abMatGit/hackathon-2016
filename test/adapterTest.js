var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var Adapter = require('../main/autobot/adapters/adapter');

describe('Adapter', function() {
    var adapter = new Adapter();

    describe('#parse', function() {
        var input = 'example input';
        var subject = adapter.parse(input);

        it('returns a hash with a command token and an args token', function() {
            assert.property(subject, 'command');
            assert.property(subject, 'args');
        });
    });

    describe('#render', function() {
        var data = { hello: 'world' };
        var subject = adapter.render(data);

        it('defaults to returning the data back', function() {
            assert.deepEqual(subject, data);
        });
    });

    describe('#receive', function() {
        var input = 'echo wtf';
        var subject = adapter.receive(input);
        var expected_result = ['wtf'];

        it('will return a promise that renders the processed input', function() {
            return expect(subject).to.eventually.become(expected_result);
        });

        context('it uses the adapter render method in the promise response data', function() {
            Adapter.prototype.render = function(data) { return { text: data }; };
            var subject = adapter.receive(input);
            var expected_result = { text: ['wtf'] };

            it('will return a promise that renders the processed input', function() {
                return expect(subject).to.eventually.become(expected_result);
            });
        });

    });
});
