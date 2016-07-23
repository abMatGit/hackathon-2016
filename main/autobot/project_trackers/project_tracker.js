var ProjectTracker = function (client) {
    this.client = client;
}

ProjectTracker.prototype = {
    getStory: function (storyId, handler) {
        this.client.findIssue(storyId, handler);
    },

    getStatus: function (storyId, handler) {
        this.client.findIssue(storyId, handler);
    }
};

module.exports = ProjectTracker;
