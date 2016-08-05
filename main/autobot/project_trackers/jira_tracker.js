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

// Temp proof of concept for promises
Jira.prototype.getUsersIssues = function(username) {
  var client_username = '';
  // we need to store this mapping into Dynamo or some 3rd party storage logic
  if(username == 'amat'){
    client_username = 'amatuszewski';
  } else if(username == 'alan') {
    client_username = 'alan';
  } else {
    client_username = 'amatuszewski';
  }

  var client = this.client;

  return new Promise(function(resolve, reject) {
    client.getUsersIssues(client_username, true, function(err, data) {
      if (err) { reject(err); }
      else { resolve(data.issues); }
    });
  });
}

module.exports = new Jira(jira_client);
