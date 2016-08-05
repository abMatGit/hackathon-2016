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
    var success = function (value) {
        callback(value);
    };

    var failure = function(reason) {
        callback(null, reason);
    }

    let tokens = input.split(' ')
    let cmdName = tokens[0];
    let cmdArgs = tokens.slice(1);

    switch (cmdName) {
        case 'status':
            var userName = cmdArgs[0];

            jira.getUsersIssues(userName, true, function (err, data) {
                if (err) {
                    callback(err);
                } else {
                    var total = data.total;
                    var msg = "User issues: \n";
                    for (var i = 0; i < total; i++) {
                        msg +=
                            data.issues[i].key +
                            " " +
                            data.issues[i].fields.summary +
                            "\n";
                    };

                    callback(null, msg);
                }
            });
            break;

        case 'sprint':
            var rapidView = new Promise(function (resolve, reject) {
                jira.findRapidView('iOS Sprint Backlog', function(err, data) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve({
                            rapidViewId: data.id
                        });
                    };
                })
            });

            var lastSprint = function (params) {
                return new Promise(function(resolve, reject) {
                    jira.getLastSprintForRapidView(params.rapidViewId, function(err, data) {
                        if (err) {
                            reject(err);
                        } else {
                            params['sprintId'] = data.id;
                            resolve(params);
                        }
                    });
                });
            };

            var sprintIssues = function (params) {
                return new Promise(function(resolve, reject) {
                    jira.getSprintIssues(
                        params.rapidViewId,
                        params.sprintId,
                        function(err, data) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve({
                                    completed: data.contents.completedIssues,
                                    notCompleted: data.contents.issuesNotCompletedInCurrentSprint,
                                });
                            }
                        })
                });
            };

            var printSprintIssues = function(sprintIssues) {
                var msg = "\nCurrent Sprint stories: \n";
                msg =+ "Not completed: \n";
                for (var issue of sprintIssues.notCompleted) {
                    msg += issue.key + ": " + issue.summary + "\n";
                }

                msg += "\nDone: \n";
                for (var issue of sprintIssues.completed) {
                    msg += issue.key + ": " + issue.summary + "\n";
                }

                return msg;
            }

            rapidView.
                then(lastSprint).
                then(sprintIssues).
                then(printSprintIssues).
                then(success, failure);

            break;

        case 'prs':
            var promise = new Promise(
                function(resolve, reject) {
                    github.issues.getForRepo({
                        user: 'lumoslabs',
                        repo: 'LumosityMobile'
                    }, function(err, res) {
                        if (err) {
                            reject(err)
                        } else {
                            var result = res.reduce(function(collector, issue) {
                                return collector + '\n' + issue.html_url;
                            }, "Pull Requests:");
                            resolve(result);
                        }
                    });
                });

            promise.then(function(value) {
                callback(null,value)
            }, function(reason) {
                callback(reason);
            });

            break;
        default:
            callback(cmdName + " command not found.");
    }
}
