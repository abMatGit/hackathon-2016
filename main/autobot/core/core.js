var jiraResource = require('../resources/jira');
var access = require('../../lib/resource_accessor').access;

class Core {
  constructor(commands, resource) {
    this.resource = resource;
    this.commands = commands;
  }

  process(inputTokens) {
    var commandToken = inputTokens['command'];
    var args         = inputTokens['args'];

    // TODO: replace a simple 'access' with a regex or intelligent mapping
    var cmd = access(commands, commandToken)
    return cmd(args);
  }
}

var commands = {
    echo: function (args) {
        return new Promise(function(resolve, reject) {
            if (args) { resolve(args); }
            else { reject(args); }
        });
  },

  get: function (args) {
    var username = args[0];
    return this.resource.getUsersIssues(username);
  }

}

module.exports = new Core(commands, jiraResource);
