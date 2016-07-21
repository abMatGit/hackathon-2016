var config = require('../../../configs/jira_credentials');

var ProjectTracker = require('../autobot/project_trackers/project_tracker');
var JiraApi = require('jira').JiraApi;

var Jira = Object.create(ProjectTracker);

var tracker = new JiraApi(
    config.protocol,
    config.host,
    config.port,
    config.username,
    config.password,
    config.api_version);

module.exports = new Jira(tracker);
