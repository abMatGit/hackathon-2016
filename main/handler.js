'use strict';

//module.exports.handler = function(event, context, cb) {
//  var text = (event.text === undefined ? "No text" : event.text);
//  return cb(null, {
//    message: 'Go Serverless! Your message is: ' + text
//  });
//};

var AWS = require('aws-sdk');
var qs = require('querystring');
var token, kmsEncyptedToken;

kmsEncyptedToken = "CiDW440/VM2MfOqfynzRZtgDXPyh0f9dsXta46rGATW7WBKfAQEBAgB41uONP1TNjHzqn8p80WbYA1z8odH/XbF7WuOqxgE1u1gAAAB2MHQGCSqGSIb3DQEHBqBnMGUCAQAwYAYJKoZIhvcNAQcBMB4GCWCGSAFlAwQBLjARBAxuWX2EDSRMSMqUtZcCARCAMzz9o0Kyr8MMF3+H2Prx+u/og5mi4jxQ7/MWYvv94o/Q/7KYnjMi71fEoI+y0Yml2ou2vQ==";


module.exports.handler = function (event, context, cb) {
    if (token) {
        // Container reuse, simply process the event with the key in memory
        processEvent(event, context);
    } else if (kmsEncyptedToken && kmsEncyptedToken !== "<kmsEncryptedToken>") {
        var encryptedBuf = new Buffer(kmsEncyptedToken, 'base64');
        var cipherText = {CiphertextBlob: encryptedBuf};

        var kms = new AWS.KMS();
        kms.decrypt(cipherText, function (err, data) {
            if (err) {
                console.log("Decrypt error: " + err);
                context.fail(err);
            } else {
                token = data.Plaintext.toString('ascii');
                processEvent(event, context);
            }
        });
    } else {
        context.fail("Token has not been set.");
    }
};

var processEvent = function(event, context) {
    var body = event.body;
    var params = qs.parse(body);
    var requestToken = params.token;
    if (requestToken !== token) {
        console.error("Request token (" + requestToken + ") does not match exptected");
        context.fail("Invalid request token");
    }

    var user = params.user_name;
    var command = params.command;
    var channel = params.channel_name;
    var commandText = params.text;

    context.succeed(user + " invoked " + command + " in " + channel + " with the following text: " + commandText);
};
