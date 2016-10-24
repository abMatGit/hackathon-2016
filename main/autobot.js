'use strict';

var Handler = require('./autobot/handler');
var access = require('./lib/resource_accessor').access;
var Adapters = require('./autobot/adapters');
var googleCore = require('./autobot/core/core').google;
var defaultCore = require('./autobot/core/core').default;

class Autobot {
  constructor(adapter, coreType) {
    var adapterClass = access(Adapters, adapter);
    if(coreType == 'google') { this.adapter = new adapterClass(googleCore); }
    else { this.adapter = new adapterClass(defaultCore); }
  }

  receive(input) {
    return this.adapter.receive(input);
  }
};

module.exports = Autobot;
