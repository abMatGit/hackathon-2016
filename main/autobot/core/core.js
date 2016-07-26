var tracker = require('../project_trackers/jira_tracker');

var Core = function(commands, tracker) {
  this.commands = commands;
  this.tracker = tracker;
}

var getStatusOfIssue = function (issue) {
  return issue.fields.status.name;
};

var commands = {
  'echo': function (input, handler) {
    handler.ok(input);
  },

  'getStory': function (args, handler) {
    tracker.getStory(args, function (err, issue) {
      if (err) {
        handler.err(err);
      } else {
        handler.ok("Status is: " + getStatusOfIssue(issue));
      }
    });
  }
}

module.exports = new Core(commands, tracker);
