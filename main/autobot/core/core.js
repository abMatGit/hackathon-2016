var tracker = require('../project_trackers/jira_tracker');

var Core = function(commands, tracker) {
  this.commands = commands;
  this.tracker = tracker;
}

var commands = {
  'echo': function (input, handler) {
      handler.ok(input);
  },

  'getStory': function (args) {
    var storyId = args[0];
    return tracker.getStory(storyId);
  },

  'getUsersIssues': function (args) {
    var username = args[0];
    return tracker.getUsersIssues(username);
  }
}

module.exports = new Core(commands, tracker);
