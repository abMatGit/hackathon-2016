class Core {
  constructor(commands, callbacks) {
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
    tracker.getStatus(args, handler);
  }
}

var callbacks = {
  'echo': function(err, input) {
    return input;
  },

  'getStatus': function(err, issue) {
    console.log('Status: ' + issue.fields.status.name);
    return issue;
  },
}

module.exports = new Core(commands, callbacks);
