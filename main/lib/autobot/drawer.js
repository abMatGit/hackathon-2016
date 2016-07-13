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

module.exports.drawInstruction = function (instruction, task) {
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
        this.statusEmoji(task),
        this.jiraLink(instruction.taskName),
        this.body(task)
    ].join(" ");

    return retString;
};

module.exports.drawInstructions = function(instructions, tasks) {
    var lines = [];
    lines.push("Status");
    for (var i = 0, l = instructions.length; i < l; i ++) {
        var instruction = instructions[i];
        var task = tasks[instruction.taskName];

        lines.push(this.drawInstruction(instruction, task));
    }
    lines.push(this.drawLegend());
    return lines.join("\n");
};

module.exports.drawLegend = function() {
  var lines = [];
  lines.push(".\n===============   Legend   ===============");
  lines.push(this.BLOCKER + " Blocker   " + this.PARTIAL + " Partially done, but not a blocker  " + this.DONE + "  Done");
  return lines.join("\n");
};
