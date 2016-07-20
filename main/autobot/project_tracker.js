var Handler = require('../autobot/handler');

var JiraTracker = function() {
    this.someshit = 'token';
}

var ProjectTracker = function (name) {
    this.tracker = new JiraTracker();
}

ProjectTracker.prototype = {
    getStory: function (storyId, callback) {
        var handler = new Handler(callback);

        var story = {
            id: "foo"
        };

        handler.ok(story);
    }
}

module.exports = ProjectTracker;
