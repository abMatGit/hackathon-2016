var config = require('./configs/jira_credentials');

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

Jira.prototype.getUsersIssues = function(username, callback) {
  var client_username = '';
  // we need to store this mapping into Dynamo or some 3rd party storage logic
  if(username == 'amat'){
    client_username = 'amatuszewski';
  } else if(username == 'alan') {
    client_username = 'alan';
  } else {
    client_username = 'amatuszewski';
  }

  this.client.getUsersIssues(client_username, true, callback);
}

module.exports = new Jira(jira_client);
