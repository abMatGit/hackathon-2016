var doc = require('dynamodb-doc');
var dynamo = new doc.DynamoDB();
var autobot = require('./autobot');

var tableName = "tasks";

module.exports = {
    omg: function (args, params, context) {

        var msg = {
            text: autobot.drawTasks(params.autobot.tasks)
        };

        context.succeed(msg);
    },

    status: function (args, params, context) {
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

        context.succeed({
            text: (chunks.join("\n"))
        });
    },

    scan: function(args, params, context) {
        var arg_task = args[0];

        var scan_params = {
            "TableName": tableName,
            "FilterExpression": "task = :feature-task",
            "ExpressionAttributeValues": { ":feature-task": "IOS-1617" }
        }

        dynamo.scan(scan_params).eachPage(function(err, data) {
            if (err) {
                console.error("error message: " + err);
                context.succeed({
                  text: 'error putting item into dynamodb failed: '+err
                });
            }
            else {
                console.log('great success: '+JSON.stringify(data));
                context.succeed({
                  text: 'great success: '+JSON.stringify(data)
                });
            }
        });
    },

    get: function(args, params, context) {
        var argTask = args[0];

        var getParams = {
            "TableName": tableName,
            "Key": {
                "task": argTask
            }
        };

        dynamo.getItem(getParams, function(err, data) {
            if (err) {
                console.error("error message: " + err);
                context.succeed({ text: 'error putting item into dynamodb failed: '+err});
            }
            else {
                console.log('great success: '+JSON.stringify(data));
                context.succeed('great success: '+JSON.stringify(data));
            }
        });
    },

    update: function(args, params, context) {
        var argTask = args[0];
        var argStatus = args[1];

        var update_params = {
            "TableName": tableName,
            "Key": {
                "task": argTask
            },
            "AttributeUpdates": {
                "status": {
                    "Action": "PUT",
                    "Value": argStatus
                }
            }
        };

        dynamo.updateItem(updateParams, function(err, data) {
            if (err) {
                console.error("error message: " + err);
                context.succeed({text: 'error putting item into dynamodb failed: '+err});
            }
            else {
                console.log('great success: '+JSON.stringify(data, null, '  '));
            }
        });
    }
};
