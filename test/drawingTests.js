var assert = require('chai').assert;
var Parser = require('../main/lib/parser');
var d = require('../main/lib/drawer');
var testExamples = require('./fixtures/drawing_fixture');

var tasks = testExamples.tasks;
var multipleRootTasks = testExamples.multipleRootTasks;
var multipleBlockingTasks = testExamples.multipleBlockingTasks;
var unorderedTasks = testExamples.unorderedTasks;

describe('Parser', function() {
    describe('drawingInstructions()', function() {
        it('yields drawing instructions ', function() {
            assert.deepEqual(Parser.getDrawingInstructions(tasks.input), tasks.expected);
        });

        context('when there are multiple root tasks', function() {
            it('yeilds drawing instructions for each root', function() {
                assert.deepEqual(Parser.getDrawingInstructions(multipleRootTasks.input), multipleRootTasks.expected);
            });
        });

        context('when there are multiple stories that are blocked on the same task', function() {
            it('yeilds drawing instructions for each story along with the blocking task', function() {
                assert.deepEqual(Parser.getDrawingInstructions(multipleBlockingTasks.input), multipleBlockingTasks.expected);
            });
        });

        context('when the tasks provided are unordered', function() {
            it('solves the dependencies and yeilds drawing instructions', function() {
                assert.deepEqual(Parser.getDrawingInstructions(unorderedTasks.input), unorderedTasks.expected);
            });
        });
    });
});

describe('Drawer', function () {
    it('draws padding and shanannigansnsgaz', function () {
        var task = 'IOS-1618';

        var result = d.draw({
            padding: 1, task: task
        }, tasks);

        var expected = [
            d.ARROW,
            d.DONE,
            d.jiraLink(task),
            d.body(tasks[task])].join(" ");

        assert.equal(result, expected);
    });
});
