var Handler = require('./autobot/handler');
var access = require('./lib/resource_accessor').access;
var Adapters = require('./autobot/adapters');

class Autobot {
  constructor(adapter) {
    var adapterClass = access(Adapters, adapter);
    this.adapter = new adapterClass(this);
    this.handler = null;
  }

  receive(input, cb) {
    this.handler = new Handler(cb);
    this.adapter.receive(input);
  }

  respond(msg) {
    this.handler.ok(msg);
  }

  error(err) {
    console.log('hello error!');
    this.handler.error(err);
    throw err;
  }
};

module.exports = Autobot;
