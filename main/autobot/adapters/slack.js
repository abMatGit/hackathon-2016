var Adapter = require('../adapters/adapter');

var Parser = function() {
  this.parseInput = function(input) {
    // input = autobot getStatus IOS-9999
    var inputTokens = input.split(' ');

    return {
      command: inputTokens[1],
      args: inputTokens.slice(2)
    };
  };

  this.getStatusEmoji = function(colourName) {
    switch(colourName) {
      case 'yellow':
        return ':yellow_light:';
        break;
      case 'green':
        return ':green_light:';
        break;
      case 'red':
        return ':red_light:';
        break;
    }
  };

  this.drawIssues = function(issues) {
    var issueKey;
    var issuesDrawn = "";
    for(issueKey in issues) {
      var issue = issues[issueKey];

      var start_statement = ':child_arrow: ';
      var issueColour = this.getStatusEmoji(issue.fields.status.statusCategory.colorName) + " ";
      var jiraLink = "<https://lumoslabs.atlassian.net/browse/" + issue.key + "|" + issue.key + "> ";
      var summary = issue.fields.summary;

      issuesDrawn = issuesDrawn + start_statement + issueColour + jiraLink + summary + "\n";
    }
    return issuesDrawn;
  };
}

var Slack = function (core) {
    this.core = core;
    this.parser = new Parser();
}

Slack.prototype = Object.create(Adapter.prototype);

Slack.prototype.adaptOutput = function(output) {
  return { 'text': this.parser.drawIssues(output) };
}

Slack.prototype.parseInput = function(input) {
  return this.parser.parseInput(input);
};

module.exports = Slack
