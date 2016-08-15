Slack = require('./adapters/slack');
Cli = require('./adapters/cli');

module.exports = {
  default: Slack,
  slack: Slack,
  cli: Cli
}
