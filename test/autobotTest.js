var assert = require('chai').assert;
var Autobot = require('../main/autobot');

describe('Adapters', function () {
    context('Slack', function () {
        var slack = new SlackAdapter();

describe('Autobot', function () {
    var autobot = new Autobot();
    var echoInput = function (input, data, handler) {
        handler.success(input.args[0]);
    };
        //var autobot = new Autobot('slack');

        //describe('#readEvent', function () {
            //it('errors when no command can be found', function () {
                //autobot.process_input('nocommand', function(err, output) {
                    //assert.equal(err, Autobot.CommandNotFoundError);
                //});
            //});

    it('uses a callback to error back out', function () {
        autobot.commands.echoInput = echoInput;
        autobot.process_input('echoInput echo', function(err, output) {
            assert.equal(err, null);
            assert.equal(output, 'echo');
        });
    });
});
