var assert = require('chai').assert;
var taskFixture  = require('../fixtures/task_fixture.js');

var tasks = taskFixture.tasks;

var printTask = function(task) {
    status_messages =
      [
        "Task: " + task.id,
        "Title: " + task.title,
        "Status: " + task.status,
        "Owner: " + task.owner,
        "Dependent on: " + task.dependsOn.join(' ')
      ];
      return status_messages.join('\n');
};

var statusCommand = function (args) {
    var status_message = "";
    if (args.length > 0) {
        task_id = args[0];
        task = tasks[task_id];

        if (task == undefined) {
            status_message = "No task found";
        } else {
            status_message = printTask(task);
        }
    } else {
        for(var taskId in tasks) {
            status_message += printTask(tasks[taskId]);
        }
    }

    // use all stories
    return status_message;
};

describe('Status Command', function () {
    context('if a story/multiple stories are passed in', function() {

        context('if the story exists', function() {
            it('displays the full status of the story', function() {
              var result = statusCommand(['IOS-01']);
              assert(result, printTask(tasks['IOS-01']));
            });
        });

        context('if no story exists', function() {
            it('tells the user no story exists', function() {
              var result = statusCommand(['im retarded?']);
              assert(result, 'No task found');
            });
        });
    });

    it('display everything if no story is passed in', function() {
        var result = statusCommand([]);
        var expectedOutput = '';

        for (var taskId in tasks) {
            expectedOutput += printTask(tasks[taskId]);
        }
        assert.equal(result, expectedOutput);
    });
});
