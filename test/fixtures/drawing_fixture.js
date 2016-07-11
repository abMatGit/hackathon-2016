var d = require('../../main/lib/drawer');

module.exports.drawingTasks = {
    "IOS-01" : {
        title: "task a",
        status: "blocker",
        owner: "alan",
        dependsOn: ["IOS-02"]
    },
    "IOS-02" : {
        title: "task b",
        status: "partial",
        owner: "brandon",
        dependsOn: ["IOS-03", "IOS-04"]
    },
    "IOS-03" : {
        title: "task c",
        status: "done",
        owner: "sonia",
        dependsOn: []
    },
    "IOS-04" : {
        title: "task d",
        status: "done",
        owner: "amat",
        dependsOn: []
    }
};

module.exports.sampleDrawing = {
    input: {
      padding: 1,
      task: 'IOS-01'
    },
    expected: [
        d.ARROW,
        d.DONE,
        d.jiraLink('IOS-01'),
        d.body(this.drawingTasks['IOS-01'])
    ].join(" ")
};
