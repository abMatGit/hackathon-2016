var assert = require('chai').assert;
var ProjectTracker = require('../main/autobot/project_trackers/project_tracker');

var Client = function () {
  this.findIssue = function(story, callback) {
    callback(null, story);
  }
};

describe('Project Tracker', function () {
    describe('getStory', function () {
        it('returns the storyID on data', function (done) {
            var client = new Client();
            var tracker = new ProjectTracker(client);

            tracker.getStory('IOS-1381', function(err, data) {
              assert.equal(data, 'IOS-1381');
              done();
            });
        });
    });
});
