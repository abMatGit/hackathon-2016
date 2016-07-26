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
  },

  'getUsersIssues': function (args, handler) {
    tracker.getUsersIssues(args, function (err, data) {
      if (err) {
        handler.err(err);
      } else {
        var total = data.total;
        var return_string = "";
        for (var i = 0; i < total; i++) {
          return_string = return_string + "\nIssue: " + data.issues[i].key;
        };
        handler.ok("User issues: " + return_string);
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
