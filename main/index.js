#!/usr/bin/env node

var program = require('commander');
var fixtureTasks = require('./fixtures/hardcoded_tasks');
var autobotAdapter = require('./lib/adapters/command_line');

var params = {};

program
  .arguments('<command>')
  .action(function(cmd) {
    autobotAdapter.processCommand(cmd, params);
  })
  .parse(process.argv);

