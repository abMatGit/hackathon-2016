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
    }
};
