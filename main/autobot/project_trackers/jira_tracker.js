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

var getJiraUsername = function(username) {
  switch(username) {
    case 'amat':
      return 'amatuszewski';
      break;
    case 'alan':
      return 'alan';
      break;
    default:
      return username;
  }
}

Jira.prototype.getUsersIssues = function(username) {
  var client_username = getJiraUsername(username);
  var client = this.client;

  return new Promise(function(resolve, reject) {
    client.getUsersIssues(client_username, true, function(err, data) {
      if (err) { reject(err); }
      else { resolve(data.issues); }
    });
  });
}

module.exports = new Jira(jira_client);
