var Parser = require('./parser');
var Drawer = require('./drawer');

module.exports.drawTasks = function (tasks) {
    var instructions = Parser.getDrawingInstructions(tasks);

    var lines = [];
    lines.push("Status");
    for (var i = 0, l = instructions.length; i < l; i ++) {
        lines.push(Drawer.draw(instructions[i], tasks));
    }
    lines.push(".\n===============   Legend   ===============");
    lines.push(Drawer.BLOCKER + " Blocker   " + Drawer.PARTIAL + " Partially done, but not a blocker  " + Drawer.DONE + "  Done");
    return lines.join("\n");
};
