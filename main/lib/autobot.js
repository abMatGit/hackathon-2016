var Parser = require('./parser');
var Drawer = require('./drawer');

module.exports.drawTasks = function (tasks) {
    var instructions = Parser.getDrawingInstructions(tasks);

    var lines = [];
    for (var i = 0, l = instructions.length; i < l; i ++) {
        var instruction = instructions[i];

        lines.push(Drawer.draw(instruction, tasks));
    }

    return lines.join("\n");
};
