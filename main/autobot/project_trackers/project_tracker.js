var ProjectTracker = function(client){
  this.client = client;
}

ProjectTracker.prototype.getStory = function(storyId, callback) {
    this.client.findIssue(storyId, callback);
}

ProjectTracker.prototype.getStatus = function(storyId, callback) {
  this.client.findIssue(storyId, callback);
}

module.exports = ProjectTracker;
