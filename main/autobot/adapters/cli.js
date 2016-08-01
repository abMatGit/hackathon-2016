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

  this.drawIssues = function(issues) {
    var issueKey;
    var issuesDrawn = "";
    for(issueKey in issues) {
      var issue = issues[issueKey];
      var start_statement = '-> ';
      var issueColour = this.getStatusEmoji(issue.fields.status.statusCategory.colorName) + " ";
      var jiraLink = issue.key + " ";
      var summary = issue.fields.summary;

      issuesDrawn = issuesDrawn + start_statement + issueColour + jiraLink + summary + "\n";
      console.log(start_statement + issueColour + jiraLink + summary);
    }

    return issuesDrawn;
  };
}

var Cli = function (core) {
    this.core = core;
    this.parser = new Parser();
}

Cli.prototype = Object.create(Adapter.prototype);

// We pass this into the Handler instance
Cli.prototype.adaptOutput = function(output) {
  return this.parser.drawIssues(output.issues);
}

Cli.prototype.parseInput = function(input) {
  return this.parser.parseInput(input);
};

module.exports = Cli
