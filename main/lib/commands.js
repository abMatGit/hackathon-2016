var doc = require('dynamodb-doc');
var dynamo = new doc.DynamoDB();

module.exports = {
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

    query: function(args, params, context) {
        var tableName = "hackathon";
        var arg_task = args[0];

        var dynamo_params = {
            "TableName": "hackathon",
            "KeyConditionExpression": "task-parent = null"
        };

        dynamo.query(dynamo_params, function(err, data) {
            if (err) {
                console.error("error message: " + err);
                context.done('error','putting item into dynamodb failed: '+err);
            }
            else {
                console.log('great success: '+JSON.stringify(data));
                context.done('great success: '+JSON.stringify(data));
            }
        });
    },

    get: function(args, params, context) {
        var tableName = "hackathon";
        var arg_task = args[0];

        var dynamo_params = {
            "TableName": "hackathon",
            "Key": {
                "task": "IOS-1617"
            }
        };

        dynamo.getItem(dynamo_params, function(err, data) {
            if (err) {
                console.error("error message: " + err);
                context.done('error','putting item into dynamodb failed: '+err);
            }
            else {
                console.log('great success: '+JSON.stringify(data));
                context.done('great success: '+JSON.stringify(data));
            }
        });
    },

    update: function(args, params, context) {
        var tableName = "hackathon";
        var arg_task = args[0];
        var arg_status = args[1];

        var dynamo_params = {
            "TableName": "hackathon",
            "Key": {
                "task": arg_task
            },
            "AttributeUpdates": {
                "status": {
                    "Action": "PUT",
                    "Value": arg_status
                }
            }
        };

        dynamo.updateItem(dynamo_params, function(err, data) {
            if (err) {
                console.error("error message: " + err);
                context.done('error','putting item into dynamodb failed: '+err);
            }
            else {
                console.log('great success: '+JSON.stringify(data, null, '  '));
            }
        });
    }
};
