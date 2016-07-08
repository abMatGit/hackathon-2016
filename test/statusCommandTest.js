var assert = require('chai').assert;
var Parser = require('../main/lib/parser');

console.log(Parser);

var tasks = {
    "IOS-1617" : {
        title: "Full stack 'analysis of technique' screen",
        status: "blocker",
        owner: "alan",
        dependsOn: ["IOS-1619"]
    },
    "IOS-1619" : {
        title: "Integrate stats into 'analysis of technique' screen",
        status: "partial",
        owner: "brandon",
        dependsOn: ["IOS-1707", "IOS-1618"]
    },
    "IOS-1707" : {
        title: "UI for 'analysis of technique' screen",
        status: "done",
        owner: "sonia",
        dependsOn: []
    },
    "IOS-1618" : {
        title: "UI for 'analysis of technique' screen",
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
