var Autobot = require('./autobot');

printResult = function(err, data) {
    if (err) {
        console.log(err);
        return;
    }

    console.log(data);
};

Autobot('status alan', printResult);
Autobot('prs', printResult);
Autobot('sprint', printResult);
