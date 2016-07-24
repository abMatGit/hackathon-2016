var tracker = require('../project_trackers/jira');

class Core {
  constructor(commands, callbacks, tracker) {
    this.commands = commands;
    this.callbacks = callbacks;
  }
}

var commands = {
  'echo': function (input, handler) {
    handler.ok(input.args);
  },

  'getStory': function (args, handler) {
    tracker.findIssue(args);
    handler.ok(data);
  },

  'getStatus': function (args, handler) {
    storyId = args[0];
    tracker.getStatus(storyId, handler);
  }
}

var callbacks = {
  'echo': function(err, input) {
    return input;
  },

  'getStatus': function(err, issue) {
    console.log('Status: ' + issue.fields.status.name);
    console.log('error:' + err);
    return issue;
  },
}

module.exports = new Core(commands, callbacks, tracker);
