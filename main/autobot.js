var Handler = require('./autobot/handler');
var access = require('./lib/resource_accessor').access;
var Adapters = require('./autobot/adapters');

class Autobot {
  constructor(adapter) {
    var adapterClass = access(Adapters, adapter);
    this.adapter = new adapterClass(this);

  }

  receive(input, cb) {
    this.handler = new Handler(cb);
    this.adapter.receive(input)
  }

  respond(msg) {
    this.handler.ok(msg);
  }

  error(err) {
    this.handler.error(err);
  }
};

module.exports = Autobot;
