var Adapter = require('../adapters/adapter');

class Cli extends Adapter {

  /* Right now this parsing is very dumb.
     It is mapping the first word of the console input directly to a core function
     TODO: Implement a regex or some sort of language parser
           for more intelligent mapping.
  */
  parse(input) {
    var tokens = input.trim().split(' ');
    return { command: tokens[0], args: tokens.slice(1) }
  }


  /*
    TODO: Have an object whose responsibility it is to render
          this data depending on what kind of data it is?
  */
  render(data) {
    return data;
  }
}

module.exports = Cli
