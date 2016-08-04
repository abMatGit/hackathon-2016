var Autobot = require('./autobot');

Autobot('status alan', function(err, data) {
    if (err) {
        console.log(err);
        return;
    }

    console.log(data);
});
