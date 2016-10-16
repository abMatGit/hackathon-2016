'use strict';

var Handler = require('./autobot/handler');
var access = require('./lib/resource_accessor').access;
var Adapters = require('./autobot/adapters');
var googleCore = require('./autobot/core/core').google;

class Autobot {
  constructor(adapter) {
    var adapterClass = access(Adapters, adapter);
    this.adapter = new adapterClass(googleCore);
  }

  receive(input) {
    return this.adapter.receive(input);
  }
};

module.exports = Autobot;
