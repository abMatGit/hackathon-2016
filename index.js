require('babel-register');

class Test {
    run() {
        console.log('running suite');
    }
}

const t = new Test();
t.run();
