#!/usr/bin/env node

var program = require('commander');

program
  .arguments('<statements...>')
  .action(function(statements) {
    console.log(statements.join(' '))
  })
  .parse(process.argv);
