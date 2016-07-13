var assert = require('chai').assert;

var statusCommand = function (args) {
    if (args.length > 0) {
        // use specific story
    }

    // use all stories
    return 'yes';
};

describe('Status Command', function () {
    it('display everything if no story is passed in', function() {
        var result = statusCommand(['im retarded?']);
        assert.equal(result, 'no');
    });
});
