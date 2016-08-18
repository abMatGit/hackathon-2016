var access = require('../..//lib/resource_accessor').access;
var Core = require('../core/core');

class Adapter {
  constructor(autobot, core = Core) {
    this.autobot = autobot;
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
    return { command: '', args: [''] }
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
  receive(input, callback) {
    var inputTokens = this.parse(input);

    this.core.process(inputTokens, callback);
        //.then(function(data) {
        //console.log('sucess!');
        //console.log(data);
        //callback(null, data);
    //}, function(error) {
        //console.log('error!');
        //console.log(error);
        //callback(error);
    //}).catch(function(error) {
        //console.log('catch');
        //console.log(error);
        //callback(error);
    //});
  }

  /*
    This method forwards a rendered response back to autobot

    Arguments:
      msg - A rendered message object

    Return value:
      Returns nothing after sending the message back to autobot
  */
  respond(msg) {
    this.autobot.respond(msg);
  }

  /*
    This method handles errors by delegating back up to autobot

    Arguments:
      err - An Error object.

    Return value:
      Returns nothing
  */
  error(err) {
    this.autobot.error(err);
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
    this.respond(data);
  }
}

module.exports = Adapter;
