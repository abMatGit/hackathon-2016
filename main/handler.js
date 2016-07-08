'use strict';

var AWS = require('aws-sdk');
var qs = require('querystring');
var commands = require('./lib/commands');
var token, kmsEncyptedToken;

kmsEncyptedToken = "CiDW440/VM2MfOqfynzRZtgDXPyh0f9dsXta46rGATW7WBKfAQEBAgB41uONP1TNjHzqn8p80WbYA1z8odH/XbF7WuOqxgE1u1gAAAB2MHQGCSqGSIb3DQEHBqBnMGUCAQAwYAYJKoZIhvcNAQcBMB4GCWCGSAFlAwQBLjARBAwWvAkHtUVOUUzWASMCARCAM25NO0XPlV8HgWylaVSeiB7WXKPGSfFdEbNYOTTmN99gjgDOUSKY6dPLElANVJ0jWIlZqw==";

module.exports.handler = function (event, context) {
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

var stringToMessage = function (msg) {
    return {
        "text" : msg
    };
};

var processEvent = function(event, context) {
    var body = event.body;
    var params = qs.parse(body);
    var requestToken = params.token;
    if (requestToken !== token) {
        console.error("Request token (" + requestToken + ") does not match exptected");
        context.fail("Invalid request token");
    }
    var commandText = params.text;

    // commandText = "asdf status foo bar"
    var args = commandText.split(' ');

    // command = "status"
    var command = args[1];

    // args = "foo bar"
    args.splice(0, 2);

    runCommand(command, args, params, context);
};

var runCommand = function (name, args, params, context) {
    getCommandFromName(name, function (err, cmd) {
        if (err) {
            console.error("Command retrieval error: " + err);
            context.fail(stringToMessage(err));
        } else {
            cmd(args, params, context);
        }
    });
};

var getCommandFromName = function (name, callback) {
    switch (name) {
        case 'status':
            callback(null, commands.status);
            break;
        case 'update':
            callback(null, commands.update);
            break;
        case 'query':
            callback(null, commands.query);
            break;
        case 'get':
            callback(null, commands.get);
            break;
        default:
            callback("Command " + name + "not supported");
    }
};
