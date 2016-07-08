// Tasks status emojis
module.exports.BLOCKER = ":red_light:";
module.exports.PARTIAL = ":yellow_light:";
module.exports.DONE    = ":green_light:";

// Tasks displaying emojis
module.exports.ARROW = ":child_arrow:";
module.exports.SPACE = ":white_small_square:";

// Hyperlinks
module.exports.jiraLink = function(story) {
    return "<https://lumoslabs.atlassian.net/browse/" + story + "|" + story +">";
};

function joinStrings(a, b, joiner) {
    if (!joiner) {
        joiner = " ";
    }
    return a + joiner + b;
}

module.exports.body = function(task) {
    return joinStrings(task.title, task.owner, " | ");
};

module.exports.statusEmoji = function(task) {
    switch (task.status) {
        case 'blocker':
            return this.BLOCKER;
        case 'partial':
            return this.PARTIAL;
        case 'done':
            return this.DONE;
        default:
            console.error("Task status not valid");
            return "invalid";
    }
};

module.exports.draw = function (instruction, tasks) {
    var retString;

    if (instruction.padding > 0) {
        retString = this.ARROW;
    } else {
        retString = "";
    }

    for (var i = 0, l = instruction.padding - 1; i < l; i ++) {
        retString = joinStrings(this.SPACE, retString);
    }

    retString = [
        retString,
        this.statusEmoji(tasks[instruction.task]),
        this.jiraLink(instruction.task),
        this.body(tasks[instruction.task])
    ].join(" ");

    return retString;
};
