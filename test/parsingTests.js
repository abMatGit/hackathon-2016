var assert = require('chai').assert;
var parser = require('../main/lib/parser');

var testExamples = require('./fixtures/parsing_fixture');
var tasks = testExamples.tasks;
var multipleRootTasks = testExamples.multipleRootTasks;
var multipleBlockingTasks = testExamples.multipleBlockingTasks;
var unorderedTasks = testExamples.unorderedTasks;

describe('Parser', function() {
    describe('drawingInstructions()', function() {
        it('yields drawing instructions ', function() {
            assert.deepEqual(parser.getDrawingInstructions(tasks.input), tasks.expected);
        });

        context('when there are multiple root tasks', function() {
            it('yeilds drawing instructions for each root', function() {
                assert.deepEqual(parser.getDrawingInstructions(multipleRootTasks.input), multipleRootTasks.expected);
            });
        });

        context('when there are multiple stories that are blocked on the same task', function() {
            it('yeilds drawing instructions for each story along with the blocking task', function() {
                assert.deepEqual(parser.getDrawingInstructions(multipleBlockingTasks.input), multipleBlockingTasks.expected);
            });
        });

        context('when the tasks provided are unordered', function() {
            it('solves the dependencies and yeilds drawing instructions', function() {
                assert.deepEqual(parser.getDrawingInstructions(unorderedTasks.input), unorderedTasks.expected);
            });
        });
    });
});

