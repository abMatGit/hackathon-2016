function Handler (callback, adapter) {
    this.callback = callback || function () {};
    this.adapter = adapter || defaultAdapter;
};

var defaultAdapter = {
  'adaptOutput' : function (output) {
    return output;
  }
}

Handler.prototype = {
    ok: function (data) {
        this.callback(null, this.adapter.adaptOutput(data));
    },

    err: function (err) {
        console.error(err);
        this.callback(err);
    }
};

module.exports = Handler;
