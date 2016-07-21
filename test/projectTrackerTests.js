var assert = require('chai').assert;
var ProjectTracker = require('../main/autobot/project_tracker');

class Client {
  constructor(config) {
    this.config = config;
  }

  findIssue(story, handler) {
    handler.ok(story);
  }

  updateIssue(story, handler) {
    handler.ok(story);
  }

  // target here can be a user, project, etc.
  getIssuesFor(target, handler) {
    handler.ok(story);
  }
}; // TODO: flesh this out.

class FakeClient extends Client {
  constructor(config) {
    super(config)
  }
};

describe('Project Tracker', function () {
    describe('getStory', function () {
        it('returns the storyID on data', function (done) {
            var client = new FakeClient();
            var tracker = new ProjectTracker(client);

            tracker.getStory('IOS-1383', function (err, data) {
                assert.equal(data, 'IOS-1383');
                done();
            });
        });
    });
});
