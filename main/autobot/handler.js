function Handler (callback, adapter) {
    this.callback = callback || function () {};
    this.adapter = adapter;
};

var defaultOutputFunction = function (output) {
  return output;
};

Handler.prototype = {
    ok: function (data) {
        this.callback(null, this.adapter.adaptOutput(data));
    },

    err: function (err) {
        this.callback(err);
    }
};

module.exports = Handler;
