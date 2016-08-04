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
        handler.ok(issue);
      }
    });
  },

  'getUsersIssues': function (args, handler) {
    var username = args[0];
    tracker.getUsersIssues(username, function (err, data) {
      if (err) {
        handler.err(err);
      } else {
        handler.ok(data.issues);
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

module.exports = new Core(commands, tracker);
