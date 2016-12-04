'use strict';

var _= require('underscore');
var spline = require('cubic-spline');

class GoogleSheetParser {
  constructor(data) {
    this.data = data;
  }

  /**
    * Output:
    *         {
    *           totalMaxTime: 40,
    *           users: { mexTaco: <userData>, pierogi: <userData>, hotSauce: <userData> },
    *           totalBound: 4
    *         }
  **/
  parse(options) {
    var parsedData = { users: {} };
    var totalMaxTime = 0;
    var connected = !options.interpolate

    // if our filters length is zero then we parse all user data
    var users = this.extractUsers(this.data.filters);

    var totalBound = this.data.rows.length -1;
    var numUsers = users.length;

    for(var i in users) {
      var user = users[i];
      var userData = this.generateDataForUser(user, connected);
      if (options.interpolate) { userData = this.interpolateData(userData, numUsers, totalBound); }

      parsedData.users[user.name] = userData.timesToChart;
      totalMaxTime = Math.max(totalMaxTime, userData.maxTime);
    }

    parsedData.totalMaxTime = totalMaxTime;

    return parsedData;
  }

  /**
    * Input:
    *       userData: <userData>
    *       numUsers: 2
    *       totalBound: 30
    * Output:
    *         userData:
    *               {
    *                 ...
    *                 timesToChart: [ interpolated cubic spline data for the user ]
    *               }
  **/
  interpolateData(userData, numUsers, totalBound) {
    var interpolatedData = [];
    var numberOfDataPoints = Math.floor(1700/numUsers);
    var incrementer = totalBound / numberOfDataPoints;

    for(var x = 1; x < totalBound; x+= incrementer) {
      if( x>= userData.lowerXBound && x <= userData.upperXBound ) {
        var y = Math.round(spline(x, userData.xValues, userData.yValues));
        interpolatedData.push(y);
      } else {
        // If user is not within the domain range, he does not have a value
        interpolatedData.push(undefined);
      }
    }

    userData['timesToChart'] = interpolatedData;
    return userData;
  }

  /*
  * This should parse out the raw data and return the array of indexes corresponding to each filter name
  * Input:
  *       filters:          ['not_found', 'dude_found', 'your_mom_found']
  * Output:
  *         [
  *           { name: dude_found, index: 1 },
  *           { name: your_mom_found, index: 13 }
  *         ]
  */
  extractUsers(filters) {
    var userRows = this.data.rows[0];
    var extractedUsers = [];

    for(var i = 0; i < userRows.length; i++) {
      var name = userRows[i].toLowerCase();
      var user = {};

      // If we have no filters, then we extract all viable users
      var extractUser = (filters.length == 0 && i > 1) || _.contains(filters, name);

      if(extractUser) {
        user.name = name;
        user.index = i;
        extractedUsers.push(user);
      }
    }

    return extractedUsers;
  }

  /**
    * Input:
    *       user: { name: taco, index: 1 }
    *       connected: true
    * Output:
    *         {
    *           name: taco,
    *           points: [{ x: 2, y: 3 }, { x: 3, y: 4 }, { x: 4, y: 6 }],
    *           xValues: [ 2, 3, 4],
    *           yValues: [ 3, 4, 6],
    *           timesToChart: [undefined, 3, 4, 6, 6, 6], <~ last 2 sixes are 'connected'
    *           maxTime: 6,
    *           lowerXBound: 2,
    *           upperXBound: 4
    *         }
  **/
  generateDataForUser(user, connected) {
    var points = [], xValues = [], yValues = [];
    var timesToChart = [];
    var userData = {};

    var time = undefined;
    var lastKnownTime = undefined;
    var lowerBound = undefined;
    var upperBound = 0;
    var maxTime = 0;

    for(var i = 1; i < this.data.rows.length; i ++) {
      time = this.data.rows[i][user.index];

      if(!time && lastKnownTime && connected) { time = lastKnownTime }
      else if(time) {
        if(!lowerBound) { lowerBound = i }
        var point = { x: i, y: time };

        maxTime = Math.max(maxTime, time);
        lastKnownTime = time;
        upperBound = i;
        points.push(point);
        xValues.push(point.x);
        yValues.push(point.y);
      }
      timesToChart.push(time);
    }

    userData.name = user.name;
    userData.points = points;
    userData.xValues = xValues;
    userData.yValues = yValues;
    userData.timesToChart = timesToChart;
    userData.maxTime = maxTime;
    userData.lowerXBound = lowerBound;
    userData.upperXBound = upperBound;

    return userData;
  }
}

module.exports = GoogleSheetParser;
