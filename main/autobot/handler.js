function Handler (callback, outputFunction) {
    this.callback = callback || function () {};
    this.outputFunction = outputFunction || defaultOutputFunction;
};

var defaultOutputFunction = function (output) {
  return output;
};

Handler.prototype = {
    ok: function (data) {
        this.callback(null, this.outputFunction(data));
    },

    err: function (err) {
        console.error(err);
        this.callback(err);
    }
};

module.exports = Handler;
