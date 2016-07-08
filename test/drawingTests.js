var assert = require('chai').assert;
var Parser = require('../main/lib/parser');
var d = require('../main/lib/drawer');

var tasks = {
    "IOS-1617" : {
        title: "task a",
        status: "blocker",
        owner: "alan",
        dependsOn: ["IOS-1619"]
    },
    "IOS-1619" : {
        title: "task b",
        status: "partial",
        owner: "brandon",
        dependsOn: ["IOS-1707", "IOS-1618"]
    },
    "IOS-1707" : {
        title: "task c",
        status: "done",
        owner: "sonia",
        dependsOn: []
    },
    "IOS-1618" : {
        title: "task d",
        status: "done",
        owner: "amat",
        dependsOn: []
    }
};

describe('Parser', function() {
    describe('drawingInstructions()', function() {
        it('yields drawing instructions ', function() {
            var expected = [ {
                padding: 0,
                task: "IOS-1617"
            },
            {   padding: 1,
                task: "IOS-1619"
            },
            {   padding: 2,
                task: "IOS-1707"
            },
            {   padding: 2,
                task: "IOS-1618"
            }
            ];

            assert.deepEqual(Parser.getDrawingInstructions(tasks), expected);
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
