var config = require('../../../configs/jira_credentials');

var ProjectTracker = require('./project_tracker');
var JiraApi = require('jira').JiraApi;

var Jira = ProjectTracker;

var jira_client = new JiraApi(
    config.protocol,
    config.host,
    config.port,
    config.username,
    config.password,
    config.api_version);

module.exports = new Jira(jira_client);
