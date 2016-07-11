var assert = require('chai').assert;
var d = require('../main/lib/drawer');

var drawFixture = require('./fixtures/drawing_fixture');
var drawingTasks = drawFixture.drawingTasks;

describe('Drawer', function () {
    it('draws padding and shanannigansnsgaz', function () {
        var input = drawFixture.sampleDrawing.input;
        var result = d.draw(input, drawingTasks);
        var expected = drawFixture.sampleDrawing.expected

        assert.equal(result, expected);
    });
});
