var autobot = require('./autobot/autobot');

module.exports = {

    status: function (params) {
        console.log(autobot.drawTasks(params.tasks));
    },

    get: function(args, params, context) { },

    update: function(args, params, context) { }
};
