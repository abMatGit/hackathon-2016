module.exports.tasks = {
    input: {
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
    },
    expected: [
        {
            padding: 0,
            task: "IOS-1617"
        },
        {
            padding: 1,
            task: "IOS-1619"
        },
        {
            padding: 2,
            task: "IOS-1707"
        },
        {
            padding: 2,
            task: "IOS-1618"
        }
    ]
};

module.exports.multipleRootTasks = {
    input: {
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
        },
        "IOS-1750" : {
            title: "task A",
            status: "partial",
            owner: "amat",
            dependsOn: ["IOS-1751"]
        },
        "IOS-1751" : {
            title: "task B",
            status: "done",
            owner: "alan",
            dependsOn: []
        },

    },
    expected: [
        {
            padding: 0,
            task: "IOS-1617"
        },
        {
            padding: 1,
            task: "IOS-1619"
        },
        {
            padding: 2,
            task: "IOS-1707"
        },
        {
            padding: 2,
            task: "IOS-1618"
        },
        {
            padding: 0,
            task: "IOS-1750"
        },
        {
            padding: 1,
            task: "IOS-1751"
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
        "IOS-1618" : {
            title: "task d",
            status: "done",
            owner: "amat",
            dependsOn: []
        },
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
        }
    },
    expected: [
        {
            padding: 0,
            task: "IOS-1617"
        },
        {
            padding: 1,
            task: "IOS-1619"
        },
        {
            padding: 2,
            task: "IOS-1707"
        },
        {
            padding: 2,
            task: "IOS-1618"
        }
    ]
};
