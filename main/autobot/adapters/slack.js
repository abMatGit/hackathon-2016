var Adapter = require('../adapters/adapter');

var Parser = function() {
  this.parseInput = function(input) {
    var inputTokens = input.split(' ');

    return {
      command: inputTokens[1],
      args: inputTokens.slice(2)
    };
  };
}

var Drawer = function() {
  this.draw = function(command, data) {
    switch(command) {
      case 'getUsersIssues':
        console.log(this.drawIssues(data));
        break;
      case 'getStory':
        console.log(this.drawIssue(data));
        break;
      default:
        console.log(data);
    }
  }

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
    this.drawer = new Drawer();
}

Slack.prototype = Object.create(Adapter.prototype);

Slack.prototype.adaptOutput = function(command, data) {
  return { 'text': this.drawer.draw(command, data) };
}

module.exports = Slack
