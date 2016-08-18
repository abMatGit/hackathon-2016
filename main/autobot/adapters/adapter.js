var access = require('../..//lib/resource_accessor').access;
var defaultCore = require('../core/core').default;

class Adapter {
  constructor(core = defaultCore) {
    this.core = core;
  }

  /*
    This method is to parse the given input from the robot.

    Arguments:
      input - A string representing the user input

    Return value:
      A hash of parsed tokens that is readable by the core
  */
  parse(input) {
    var tokens = input.split(' ');
    return { command: tokens[0], args: tokens.slice(1) }
  }

  /*
    This method is delegated by the autobot to handle the received message.
    It will parse the input and then invoke the core command.

    Arguments:
      input - A string representing the user input

    Return value:
      It processes the input via the core module.
      We handle the response of the core module via the success/failure
      methods which delegate to render/error
  */
  receive(input) {
    var inputTokens = this.parse(input);
    return this.core.process(inputTokens).then(this.render);
  }

  /*
    This method is meant to be implemented by each adapter.
    It will render the response data from our core such that it is
    okay to be displayed to the chatsource.

    Arguments:
      data - A data object from the core

    Return value:
      A properly formatted/rendered form of the data for the adapter source
  */
  render(data) {
    return data;
  }
}

module.exports = Adapter;
