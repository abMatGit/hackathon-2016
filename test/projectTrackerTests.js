var assert = require('chai').assert;
var ProjectTracker = require('../main/autobot/project_trackers/project_tracker');
var Handler = require('../main/autobot/handler');

var Client = function () {
  this.findIssue = function(story, callback) {
    callback(null, story);
  }
}; // TODO: flesh this out.

var FakeClient = Client;

describe('Project Tracker', function () {
    describe('getStory', function () {
        it('returns the storyID on data', function (done) {
            var client = new FakeClient();
            var tracker = new ProjectTracker(client);

            var callback = function(err, data) {
              assert.equal(data, 'IOS-1381');
              done();
            };

            tracker.getStory('IOS-1381', callback);
        });
    });
});
