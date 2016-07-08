'use strict';

var AWS = require('aws-sdk');
var doc = require('dynamodb-doc');
var dynamo = new doc.DynamoDB();
var qs = require('querystring');
var token, kmsEncyptedToken;

kmsEncyptedToken = "CiDW440/VM2MfOqfynzRZtgDXPyh0f9dsXta46rGATW7WBKfAQEBAgB41uONP1TNjHzqn8p80WbYA1z8odH/XbF7WuOqxgE1u1gAAAB2MHQGCSqGSIb3DQEHBqBnMGUCAQAwYAYJKoZIhvcNAQcBMB4GCWCGSAFlAwQBLjARBAwWvAkHtUVOUUzWASMCARCAM25NO0XPlV8HgWylaVSeiB7WXKPGSfFdEbNYOTTmN99gjgDOUSKY6dPLElANVJ0jWIlZqw==";


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

    // Dynamo Stuff
    var tableName = "hackathon";
    var datetime = new Date().getTime().toString();

    var user = params.user_name;
    var command = params.command;
    var channel = params.channel_name;
    var commandText = params.text;
    var msg = user + " invoked " + command + " in " + channel + " with the following text: " + commandText;
    var dyno_user = { "user": user, "command": commandText }
    console.log(JSON.stringify(dyno_user));
    var dynamo_params = {
      "TableName": tableName,
      "Item" : { "user": JSON.stringify(dyno_user, null, '  ') }
    }

    dynamo.putItem(dynamo_params, function(err, data) {
        if (err) {
            console.error("error message: " + err);
            context.done('error','putting item into dynamodb failed: '+err);
        }
        else {
            console.log('great success: '+JSON.stringify(data, null, '  '));
        }
    });

    context.succeed({"text" : msg});
};
