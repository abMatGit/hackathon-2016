var credentials = require('../../../configs/jira_credentials');
var JiraApi = require('jira').JiraApi;

var config = {
  protocol: 'https',
  host: credentials.host,
  port: null,
  username: credentials.username,
  password: credentials.password,
  api_version: 'latest'
}

module.exports.client = new JiraApi(config.protocol,
                                    config.host,
                                    config.port,
                                    config.username,
                                    config.password,
                                    config.api_version);

// Call this like:
// var jira_client = require('project_trackers/jira').client;
// var jira_callback = require('project_trackers/jira').status_issue_callback;
//
// Invoke it with:
// jira_client.findIssue('IOS-1697', jira_callback);
module.exports.status_issue_callback = function(err, issue) { console.log('Status: ' + issue.fields.status.name) };
