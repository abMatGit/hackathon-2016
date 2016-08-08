var ProjectTracker = function(client){
  this.client = client;
}

ProjectTracker.prototype.getStory = function(storyId) {
  var client = this.client;
  return new Promise(function(resolve, reject) {
    client.findIssue(storyId, function(err, data) {
      if(err) { reject(err); }
      else { resolve(data); }
    });
  });
}

ProjectTracker.prototype.getStatus = function(storyId) {
  var client = this.client;
  return new Promise(function(resolve, reject) {
    client.findIssue(storyId, function(err, data) {
      if(err) { reject(err); }
      else { resolve(data); }
    });
  });
}

module.exports = ProjectTracker;
