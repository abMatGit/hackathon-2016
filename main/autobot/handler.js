function Handler (callback) {
    this.callback = callback || function () {};
};

Handler.prototype = {
    ok: function (data) {
        this.callback(null, data);
    },

    err: function (err) {
        this.callback(err);
    }
};

module.exports = Handler;
