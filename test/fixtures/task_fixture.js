module.exports.tasks = {
    "IOS-01" : {
        id: "IOS-01",
        title: "task a",
        status: "blocker",
        owner: "alan",
        dependsOn: ["IOS-02"]
    },
    "IOS-02" : {
        id: "IOS-02",
        title: "task b",
        status: "partial",
        owner: "brandon",
        dependsOn: ["IOS-03", "IOS-04"]
    },
    "IOS-03" : {
        id: "IOS-03",
        title: "task c",
        status: "done",
        owner: "sonia",
        dependsOn: []
    },
    "IOS-04" : {
        id: "IOS-04",
        title: "task d",
        status: "done",
        owner: "amat",
        dependsOn: []
    }
};

