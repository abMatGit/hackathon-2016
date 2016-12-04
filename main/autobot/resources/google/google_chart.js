//  ************************ GOOGLE CHART *******************************
/*
  This class should be initialized with chart data
  {
    totalMaxTime: maximum value over all user times
    users: {
      dude: [array of values],
      dudester: [array of values],
      dudette: [array of values]
    }
  }
*/
class GoogleChart {
  constructor(data) {
    this.users = data.users;
    this.totalMaxTime = data.totalMaxTime;
  }

  generateChartColours() {
    var colours = [];
    for(var user in this.users) {
      if(this.users.hasOwnProperty(user)) {
        var colour = this.getRandomColour();
        colours.push(colour);
      }
    }

    var chartColoursString = "chco=" + colours.join(',');
    return chartColoursString;
  }

  generateEncodedChartData() {
    var dataStringSet = [];

    // iterate over each set of data
    for(var user in this.users) {
      if(this.users.hasOwnProperty(user)) {
        var values = this.users[user];
        var encodedDataString = this.simpleEncode(values, this.totalMaxTime);
        dataStringSet.push(encodedDataString);
      }
    }
    var chartData = "chd=s:" + dataStringSet.join(',');
    var chartAxisRange = "chxr=0,0," + this.totalMaxTime;

    return [chartData, chartAxisRange].join('&');
  }

  generatePlainChartData() {
    var dataStringSet = [];

    // iterate over each set of data
    for(var user in this.users) {
      if(this.users.hasOwnProperty(user)) {
        dataStringSet.push(this.users[user].join(','));
      }
    }
    var chartData = "chd=t:" + dataStringSet.join('%7C');
    var chartAxisRange = "chxr=0,0," + (this.maxTime * 1.2);

    return [chartData, chartAxisRange].join('&');
  }
  generateChartLabels() {
    var chartLabels = [];

    for(var user in this.users) {
      if(this.users.hasOwnProperty(user)) {
        chartLabels.push(user);
      }
    }

    return "chdl=" + chartLabels.join('%7C');
  }

  generateChartSize() {
    return "chs=700x400";
  }

  generateChartType() {
    var chartType = "cht=ls"; // Chart type is a line chart
    var chartAxis = "chxt=y"; // Chart axis is only the y axis
    return [chartType, chartAxis].join('&');
  }

  generateChartURL(){
    var chartArguments = [
      this.generateChartColours(),
      this.generatePlainChartData(),
      this.generateChartLabels(),
      this.generateChartSize(),
      this.generateChartType()
    ]

    return "https://chart.apis.google.com/chart?" + chartArguments.join('&');
  }

  generateEncodedChartURL(){
    var chartArguments = [
      this.generateChartColours(),
      this.generateEncodedChartData(),
      this.generateChartLabels(),
      this.generateChartSize(),
      this.generateChartType()
    ]

    return "https://chart.apis.google.com/chart?" + chartArguments.join('&');
  }

  // ************************* HELPER FUNCTIONS ***************************

  simpleEncode(valueArray,maxValue) {
    var encodedChars = [];
    var simpleEncoding = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var currentValue, encodedChar;

    for (var i = 0; i < valueArray.length; i++) {
      currentValue = valueArray[i];

      if (currentValue && currentValue > 0) {
        encodedChar = simpleEncoding.charAt(Math.round((simpleEncoding.length-1) * currentValue / maxValue));
        encodedChars.push(encodedChar);
      } else {
        encodedChars.push('_');
      }
    }
    return encodedChars.join('');
  }

  /**
    * Outputs a random 6 char hex representation of a colour
  **/
  getRandomColour(){
    var letters = '0123456789ABCDEF';
    var color = '';
    for (var i = 0; i < 6; i++ ) { color += letters[Math.floor(Math.random() * 16)]; }
    return color;
  }
}

var a = { maxTime: 60, dude: [10 ,20, 30], dudester: [20,40,60] }
module.exports = GoogleChart
