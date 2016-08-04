'use strict'

let config = require('../configs/config');
let JiraApi = require('jira').JiraApi;
let jira = new JiraApi(
    config.jira.protocol,
    config.jira.host,
    config.jira.port,
    config.jira.username,
    config.jira.password,
    config.jira.api_version);

let GithubApi = require('github');
let github = new GithubApi({
    debug: false //true
});
github.authenticate(config.github);


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
            github.issues.getForRepo({
                user: 'lumoslabs',
                repo: 'LumosityMobile'
            }, function(err, res) {
                var result = res.reduce(function(collector, issue) {
                    return collector + '\n' + issue.html_url;
                }, "Pull Requests:");

                callback(null, result);
            });
            break;
        default:
            callback(cmdName + " command not found.");
    }
}
