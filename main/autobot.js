'use strict'

let config = require('../configs/jira_credentials');
let JiraApi = require('jira').JiraApi;
let jira = new JiraApi(
    config.protocol,
    config.host,
    config.port,
    config.username,
    config.password,
    config.api_version);
let github = require('github');

module.exports = function (input, callback) {
    let tokens = input.split(' ')
    let cmdName = tokens[0];
    let cmdArgs = tokens.slice(1);

    switch (cmdName) {
        case 'status':
            var userName = cmdArgs[0];

            jira.getUsersIssues(userName, true, function (err, data) {
                if (err) { callback(err); } else {
                    var total = data.total;
                    var return_string = "";
                    for (var i = 0; i < total; i++) {
                        return_string = return_string + "\nIssue: " + data.issues[i].key;
                    };

                    callback(null, "User issues: " + return_string);
                }
            });

            break;
        case 'prs':
            var github
        default:
            callback(cmdName + " command not found.");
    }
}
