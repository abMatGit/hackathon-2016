var Adapter = require('../adapters/adapter');

var Parser = function() {
  this.parseInput = function(input) {
    // input = autobot getStatus IOS-9999
    var inputTokens = input.trim().split(' ')

    return {
      command: inputTokens[0],
      args: inputTokens.slice(1)
    };
  };
};

var Drawer = function() {
  this.draw = function(command, data) {
    switch(command) {
      case 'getUsersIssues':
        this.drawIssues(data);
        break;
      case 'getStory':
        console.log(this.drawIssue(data));
        break;
      default:
        console.log(data);
    }
  };

  this.getStatusEmoji = function(colourName) {
    switch(colourName) {
      case 'yellow':
        return '[IN PROGRESS]';
        break;
      case 'green':
        return '[COMPLETED]';
        break;
      case 'red':
        return '[BLOCKED]';
        break;
      default:
        return '[IN PROGRESS]';
    }
  };

  this.drawIssue = function(issue) {
    var start_statement = '-> ';
    var issueColour = this.getStatusEmoji(issue.fields.status.statusCategory.colorName) + " ";
    var jiraLink = issue.key + " ";
    var summary = issue.fields.summary;
    return start_statement + issueColour + jiraLink + summary;
  }

  this.drawIssues = function(issues) {
    for(issueKey in issues) {
      console.log(this.drawIssue(issues[issueKey]));
    }
  };
}

var Cli = function (core) {
    this.core = core;
    this.parser = new Parser();
    this.drawer = new Drawer();
}

Cli.prototype.adaptOutput = function(command, data) {
  this.drawer.draw(command, data);
};

Cli.prototype = Object.create(Adapter.prototype);

module.exports = Cli
