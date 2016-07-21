var assert = require('chai').assert;
var ProjectTracker = require('../main/autobot/project_tracker');

var Client = {}; // TODO: flesh this out.
var FakeClient = function () {
    this.findIssue = function (story, handler) {
        handler.ok(story);
    };
}

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
