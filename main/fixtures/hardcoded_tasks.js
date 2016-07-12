module.exports.hardCodedTasks = {
    "IOS-1617" : {
        title: "FullStack “analysis of technique” screen",
        status: "blocker",
        owner: "alan",
        dependsOn: ["IOS-1619"]
    },
    "IOS-1619" : {
        title: "Integrate stats into “analysis of technique” screen",
        status: "partial",
        owner: "brandon",
        dependsOn: ["IOS-1707", "IOS-1618"]
    },
    "IOS-1707" : {
        title: "UI for 'Analysis of technique' screen",
        status: "done",
        owner: "sonia",
        dependsOn: []
    },
    "IOS-1618" : {
        title: "Retrieve stats for speed/accuracy challenge",
        status: "done",
        owner: "amat",
        dependsOn: []
    },
    "IOS-1620" : {
        title: "UI “Challenge yourself” screen",
        status: "blocker",
        owner: "foo",
        dependsOn: []
    }
};

