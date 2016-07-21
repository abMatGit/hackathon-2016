var Handler = require('../autobot/handler');

var ProjectTracker = function (client) {
    this.client = client;
}

ProjectTracker.prototype = {
    getStory: function (storyId, callback) {
        var handler = new Handler(callback);

        this.client.findIssue(storyId, handler);
    }
};

module.exports = ProjectTracker;
