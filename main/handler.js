'use strict';

var AWS = require('aws-sdk');
var doc = require('dynamodb-doc');
var dynamo = new doc.DynamoDB();
var qs = require('querystring');
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
            callback(null, statusCommand);
            break;
        case 'test':
            callback(null, testCommand);
            break;
        default:
            callback("Command " + name + "not supported");
    }
};

///
///  C O M M A N D S
///
///  Write your command here and return on getCommandFromName
///
//
//  function (args, params, context)
//    @args : Arguments for the command
//    @params : Params from the slack request
//    @context : Lambda context
//

var statusCommand = function (args, params, context) {
    var chunks = [
      "Status",
      "<https://lumoslabs.atlassian.net/browse/IOS-1617|IOS-1617> Full stack 'analysis of technique' screen :heart: @alan",
      ":arrow_lower_right: <https://lumoslabs.atlassian.net/browse/IOS-1619|IOS-1619> Integrate stats into 'analysis of technique' screen :heart: @alan",
      ":white_small_square: :arrow_lower_right: <https://lumoslabs.atlassian.net/browse/IOS-1619|IOS-1619> Integrate stats into 'analysis of technique' screen :heart: @alan",
      ":white_small_square: :white_small_square: :arrow_lower_right: <https://lumoslabs.atlassian.net/browse/IOS-1617|IOS-1617> Build UI :heart: @alan",
      ":white_small_square: :white_small_square: :arrow_lower_right: <https://lumoslabs.atlassian.net/browse/IOS-1618|IOS-1618> Retrieve stats :yellow_heart: @somejesse",
      "~~~~~~~  Legend ~~~~~~~",
      ":heart: Blocker :yellow_heart: Partially done, but not a blocker :green_heart: Done"
    ];

    context.succeed(stringToMessage(chunks.join("\n")));
};

var testCommand = function (args, params, context) {
    // Dynamo Stuff
    var tableName = "hackathon";
    var datetime = new Date().getTime().toString();

    var user = params.user_name;
    var channel = params.channel_name;
    var commandText = params.text;
    var dyno_user = { "user": user, "command": commandText };

    console.log(JSON.stringify(dyno_user));
    var dynamo_params = {
      "TableName": tableName,
      "Item" : { "user": JSON.stringify(dyno_user, null, '  ') }
    };

    dynamo.putItem(dynamo_params, function(err, data) {
        if (err) {
            console.error("error message: " + err);
            context.fail(stringToMessage(err));
        } else {
            var result = JSON.stringify(data, null, '  ');
            console.log('great success: '+ result);
            context.succeed(stringToMessage(result));
        }
    });
};
