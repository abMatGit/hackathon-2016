var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var Autobot = require('../main/autobot');

describe('Autobot', function () {
    var autobot = null;

    context('slack adapter', function() {
        beforeEach(function() {
            autobot = new Autobot('slack');
        });

        it('uses slack adapter and the echo default command', function () {
            var promise = autobot.receive('autobot echo wtf');
            return expect(promise).to.eventually.become(["wtf"]);
        });
    });


    context('for the cli adapter', function() {
        beforeEach(function() {
            autobot = new Autobot('cli');
        });

        it('uses cli adapter and the echo default command', function () {
            return expect(autobot.receive('echo wtf')).to.eventually.become({ text: ['wtf']});
        });
    });
});
