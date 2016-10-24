module.exports.tasks = {
    input: {
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
    },
    expected: [
        {
            padding: 0,
            task: "IOS-01"
        },
        {
            padding: 1,
            task: "IOS-02"
        },
        {
            padding: 2,
            task: "IOS-03"
        },
        {
            padding: 2,
            task: "IOS-04"
        }
    ]
};

module.exports.multipleRootTasks = {
    input: {
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
        },
        "IOS-05" : {
            title: "task A",
            status: "partial",
            owner: "amat",
            dependsOn: ["IOS-06"]
        },
        "IOS-06" : {
            title: "task B",
            status: "done",
            owner: "alan",
            dependsOn: []
        },

    },
    expected: [
        {
            padding: 0,
            task: "IOS-01"
        },
        {
            padding: 1,
            task: "IOS-02"
        },
        {
            padding: 2,
            task: "IOS-03"
        },
        {
            padding: 2,
            task: "IOS-04"
        },
        {
            padding: 0,
            task: "IOS-05"
        },
        {
            padding: 1,
            task: "IOS-06"
        }
    ]
};

module.exports.multipleBlockingTasks = {
    input: {
        "IOS-01" : {
            title: "task a",
            status: "partial",
            owner: "amat",
            dependsOn: ["IOS-02", "IOS-03"]
        },
        "IOS-02" : {
            title: "task b",
            status: "blocker",
            owner: "alan",
            dependsOn: ["IOS-04"]
        },
        "IOS-03" : {
            title: "task c",
            status: "blocker",
            owner: "brandon",
            dependsOn: ["IOS-04"]
        },
        "IOS-04" : {
            title: "task d",
            status: "done",
            owner: "sonia",
            dependsOn: []
        }
    },
    expected: [
        {
            padding: 0,
            task: "IOS-01"
        },
        {
            padding: 1,
            task: "IOS-02"
        },
        {
            padding: 2,
            task: "IOS-04"
        },
        {
            padding: 1,
            task: "IOS-03"
        },
        {
            padding: 2,
            task: "IOS-04"
        }
    ]
};

module.exports.unorderedTasks = {
    input: {
        "IOS-04" : {
            title: "task d",
            status: "done",
            owner: "amat",
            dependsOn: []
        },
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
        }
    },
    expected: [
        {
            padding: 0,
            task: "IOS-01"
        },
        {
            padding: 1,
            task: "IOS-02"
        },
        {
            padding: 2,
            task: "IOS-03"
        },
        {
            padding: 2,
            task: "IOS-04"
        }
    ]
};
