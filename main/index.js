#!/usr/bin/env node

var program = require('commander');
var fixtureTasks = require('./fixtures/hardcoded_tasks');
var autobotAdapter = require('./lib/adapters/command_line');

autobot = new Autobot(CLIAdapter)

var params = {};

program
  .arguments('<command>')
  .action(function(cmd) {
    autobotAdapter.processCommand(cmd, params);
  })
  .parse(process.argv);
