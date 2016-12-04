function Handler (callback) {
    this.callback = callback;
};

Handler.prototype = {
    ok: function (data) {
        this.callback(null, data);
    },

    error: function (err) {
        this.callback(err);
    }
};

module.exports = Handler;
