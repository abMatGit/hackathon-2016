#!/usr/bin/env node

var program = require('commander');
var fixtureTasks = require('./fixtures/hardcoded_tasks');
var autobot = require('./lib/autobot');

var cmdValue;

program
  .arguments('<status>')
  .action(function(cmd) {
    cmdValue = cmd;
  })
  .parse(process.argv);

if (cmdValue == 'status') {
    var msg = autobot.drawTasks(fixtureTasks.hardCodedTasks);
    console.log(msg);
}
