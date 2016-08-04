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
      default:
        return ':yellow_light:';
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

var Drawer = function() {
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
      default:
        return ':yellow_light:';
        break;
    }
  };

  this.drawIssue = function(issue) {
    var start_statement = ':child_arrow: ';
    var issueColour = this.getStatusEmoji(issue.fields.status.statusCategory.colorName) + " ";
    var jiraLink = "<https://lumoslabs.atlassian.net/browse/" + issue.key + "|" + issue.key + "> ";
    var summary = issue.fields.summary;
    return start_statement + issueColour + jiraLink + summary + "\n";
  }

  this.drawIssues = function(issues) {
    var issuesDrawn = "";

    for(var issueKey in issues) {
      issuesDrawn = issuesDrawn + this.drawIssue(issues[issueKey]);
    }
    return issuesDrawn;
  };
}

var Slack = function (core) {
    this.core = core;
    this.parser = new Parser();
}

Slack.prototype = Object.create(Adapter.prototype);

Slack.prototype.adaptOutput = function(data) {
  return { 'text': this.parser.drawIssues(data) };
}

Slack.prototype.parseInput = function(input) {
  return this.parser.parseInput(input);
};

module.exports = Slack
