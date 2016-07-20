var assert = require('chai').assert;
var ProjectTracker = require('../main/autobot/project_tracker');

describe('Project Tracker', function () {
    describe('getStory', function () {
        it('returns foo', function (done) {
            this.timeout(50000);

            var jira = new ProjectTracker('jira');

            jira.getStory('IOS-1383', function (err, data) {
                assert.equal(data, 'foo');
                done();
            });
        });
    });
});
