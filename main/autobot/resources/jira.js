var config = require('../../../configs/jira_credentials');
var JiraApi = require('jira').JiraApi;

class Jira {
  constructor(client) {
    this.client = client
  }

  getUsersIssues(username) {
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
        else { resolve(data); }
      });
    });
  }
}

var jiraClient = new JiraApi(
    config.protocol,
    config.host,
    config.port,
    config.username,
    config.password,
    config.api_version);

module.exports = new Jira(jiraClient);
