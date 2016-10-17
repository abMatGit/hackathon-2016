'use strict';

var Handler = require('./autobot/handler');
var access = require('./lib/resource_accessor').access;
var Adapters = require('./autobot/adapters');

class Autobot {
  constructor(adapter) {
    var adapterClass = access(Adapters, adapter);
    this.adapter = new adapterClass();
  }

  receive(input) {
    return this.adapter.receive(input);
  }
};

module.exports = Autobot;
