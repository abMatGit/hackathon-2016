var Adapter = require('../adapters/adapter');

class Cli extends Adapter {

  // Right now this parsing is very dumb.
  // It is mapping the first word of the console input directly to a core function
  // TODO: Implement a regex or some sort of language parser
  //       for more intelligent mapping.
  parse(input) {
    var tokens = input.trim().split(' ');
    return { command: tokens[0], args: tokens.slice(1) }
  }

  render(data) {
    var msg = "\n Data will be rendered: \n";
    var issues = data.issues;
    for(var issue in issues) {
      var iss = issues[issue];
      msg  = msg + "->\n";
      msg  = msg + iss.key + "\n";
    }
    this.respond(msg);
  }
}

module.exports = Cli
