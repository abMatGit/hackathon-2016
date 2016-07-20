var Handler = require('../autobot/handler');
var JiraApi = require('jira').JiraApi;

var JiraTracker = function (config) {
    return new JiraApi('https',
        config.host,
        config.port,
        config.user,
        config.password,
        'latest');
}

var ProjectTracker = function (name) {
    this.tracker = JiraTracker({
        host: 'lumoslabs.atlassian.net',
        port: null,
        user: 'alan@lumoslabs.com',
        password: ''
    });
}

ProjectTracker.prototype = {
    getStory: function (storyId, callback) {
        var handler = new Handler(callback);

        this.tracker.findIssue('IOS-646', function(error, data) {
            if (error) {
                handler.err(error);
            }

            console.log(JSON.stringify(data));
            handler.ok(data);
        });
    }
}

module.exports = ProjectTracker;
