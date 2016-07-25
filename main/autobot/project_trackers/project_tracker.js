var ProjectTracker = function(client){
  this.client = client;

  this.getStory = function(storyId, callback) {
    this.client.findIssue(storyId, callback);
  }

  this.getStatus = function(storyId, callback) {
    this.client.findIssue(storyId, callback);
  }
};

module.exports = ProjectTracker;
