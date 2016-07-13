var autobot = require('../autobot/autobot');

var generateCallback = function(cmd, params) {
  switch (cmd) {
    default:
      return function (err, autobotFunction) {
        if (err) {
          console.error("Command retrieval error: " + err);
        } else {
          autobotFunction(params);
        }
      }
  }
};

module.exports = {
    processCommand: function (cmd, params) {
      var callback = generateCallback(cmd, params);

      switch (cmd) {
        case 'status':
          callback(null, autobot.Interface.status);
          break;
        default:
          callback("Command " + cmd + " not supported");
      }
    }
};
