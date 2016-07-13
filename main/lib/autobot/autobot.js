var Parser = require('./parser');
var Drawer = require('./drawer');
var taskFixture = require('../../fixtures/hardcoded_tasks.js');

module.exports.Interface = {
  status: function() {
    var tasks = taskFixture.hardCodedTasks;
    var instructions = Parser.getDrawingInstructions(tasks);
    console.log(Drawer.drawInstructions(instructions, tasks));
  }
}
