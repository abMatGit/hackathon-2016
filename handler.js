'use strict';

var qs = require('querystring');
var slackToken = require('./configs/slack_token').slackToken;
var Autobot = require('./main/autobot');

module.exports.slack = function(event, context, callback) {

  var statusCode, text;
  var body = event.body;
  var params = qs.parse(body);
  var requestToken = slackToken;

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
    var autobot = new Autobot('slack');
    autobot.receive('plankbot get amat').then(success, failure);
  }
};

/*
'use strict';

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};*/