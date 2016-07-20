var assert = require('chai').assert;
var ProjectTracker = require('../main/autobot/project_tracker');

describe('Project Tracker', function () {
    describe('getStory', function () {
        it('returns foo', function (done) {
            var jira = new ProjectTracker('jira');

            jira.getStory('foo', function (err, data) {
                assert.equal(data.id, 'foo');
                done();
            });
        });
    });
});
