var jiraResource = require('../resources/jira');
var access = require('../../lib/resource_accessor').access;

class Core {
  constructor(commands, resource) {
    this.resource = resource;
    this.commands = commands;
  }

  /*
    This method will invoke the command from the input tokens.

    Arguments:
      inputTokens - A hash of tokens which are identifiable as command and arguments
                    Should contain the following tokens:
                      command -> this will map directly to one of the core methods
                      args -> the arguments utilized for the core
                      options -> optional settings/flags/arguments

    Return value:
      A promise object representing the command's asynchronous call
  */
  process(inputTokens) {
    var commandToken = inputTokens['command'];
    var args         = inputTokens['args'];

    var cmd = access(this.commands, commandToken).bind(this);

    return cmd(args);
  }
}

var commands = {
  /*
    A simple echo call.

    Arguments:
      args - Should contain just a simple string

    Return value:
      The same as the input value -> args
  */
  echo: function (args) {
    return new Promise(function(resolve, reject) {
      if(args == null) { reject(args); }
      else { resolve(args); }
    });
  },

  /*
    This should be a fetch for data from the resource

    Arguments:
      args - should contain ids or query information to help the get call

    Return value:
      Data pertaining to the query response from the resouce.
  */
  get: function (args) {
    var username = args[0];
    return this.resource.getUsersIssues(username);
  }
}

module.exports.Core = Core;
module.exports.default = new Core(commands, jiraResource);
