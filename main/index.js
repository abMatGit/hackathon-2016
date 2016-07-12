#!/usr/bin/env node

var program = require('commander');
var fixtureTasks = require('./fixtures/hardcoded_tasks');
var autobotCLI = require('./lib/interfaces/command_line');

var cmdValue;

program
  .arguments('<status>')
  .action(function(cmd) {
    cmdValue = cmd;
  })
  .parse(process.argv);

if (cmdValue == 'status') {
    autobotCLI.status({ tasks: fixtureTasks.hardCodedTasks});
}
