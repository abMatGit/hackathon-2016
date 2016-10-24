'use strict';

var qs = require('querystring');
var slackToken = require('./configs/slack_token').slackToken;
var Autobot = require('./main/autobot');

module.exports.slack = function(event, context, callback) {};

module.exports.updateSheet = function(event, context, callback) {

  var statusCode, text;
  var body = event.body;
  var params = qs.parse(body);
  var requestToken = params.token;

  var success = function(result) {
    var response = {
      statusCode: 200,
      body: JSON.stringify(result)
    };
    callback(null, response);
  };

  var failure = function(err) {
    context.fail(err);
  };

  if (requestToken !== slackToken) {
      console.error("Request token (%s) does not match exptected", requestToken);
      context.fail("Invalid request token");
      callback("Invalid request token");
  } else {
    var autobot = new Autobot('slack', 'google');
    autobot.receive(params).then(success, failure);
  }
};
