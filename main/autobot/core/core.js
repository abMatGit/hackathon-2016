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
        handler.ok("Status is: " + issue.fields.status.name);
      }
    });
  },

  'getStatus': function (args, handler) {
    storyId = args[0];
    tracker.getStatus(storyId, function (err, issue) {
      if (err) { handler.error(err) };

      var owner = getOwner(issue);
      handler.ok(owner);
    });
  }
}

function getOwner(issue) {
  return issue.mybalss.owner;
}

module.exports = new Core(commands, tracker);
