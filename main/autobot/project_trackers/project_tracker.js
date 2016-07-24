class ProjectTracker {
  constructor(client) {
    this.client = client;
  }

  getStory(storyId, handler) {
    this.client.findIssue(storyId, handler);
  }

  getStatus(storyId, handler) {
    this.client.findIssue(storyId, handler.callback);
  }
};

module.exports = ProjectTracker;
