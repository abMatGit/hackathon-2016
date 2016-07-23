var Adapter = require('./adapter');

class Slack extends Adapter {
  constructor(core) {
    super(core);
  }

  adaptOutput(output) {
    return { 'text': output };
  }
}

module.exports = Slack
