var Adapter = require('../adapters/adapter');


class Slack extends Adapter {
  parse(input) {
    var tokens = input.split(' ');
    return { command: tokens[1], args: tokens.slice(2) }
  }

  render(data) {
    return { text: data };
    //this.respond({ text: data });
    /*
    try {
      console.log('in the respond block');
    } catch(err) {
      this.error(err);
    }*/
  }
}

module.exports = Slack
