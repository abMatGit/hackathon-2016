var assert = require('chai').assert;
var Autobot = require('../main/autobot');

describe('Autobot', function () {
    var autobot = new Autobot('slack');

    it('uses slack adapter and the echo default command', function (done) {
        autobot.receive('autobot echo wtf', function (err, data) {
            assert.equal(2, 1, 'nonsense');
        });
    });

    context('for the cli adapter', function() {
      var autobot = new Autobot('cli');

      it('uses slack adapter and the echo default command', function (done) {
          autobot.receive('echo wtf', function (err, data) {
              assert.deepEqual(data, { text: ['wtf'] });
              done();
          });
      });
    });
});
