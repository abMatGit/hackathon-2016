'use strict';

var googleAuth = require('google-auth-library');
var google = require('googleapis');
var GoogleUrl = require('google-url');

var AWS = require('aws-sdk');
var async = require('async');
var dynamo = new AWS.DynamoDB({ region: 'us-east-1' });
var _= require('underscore');

var nameIndexMapper = require('../../../configs/user_mappings').nameIndexMapper;
var nameLetterMapper = require('../../../configs/user_mappings').nameLetterMapper;
var SPREADSHEET_ID= require('../../../configs/google_credentials').spreadsheetId;
var SCOPES = [  'https://www.googleapis.com/auth/spreadsheets' ];

var doc = google.sheets('v4');

// --------------------------- DYNAMO CREDENTIAL READS ----------------------------- //
//

function readCredentials(callback) {
  var params = {
    TableName: 'oauth',
    Key: { provider: { S: 'google-client' } },
    AttributesToGet: [ 'provider', 'value' ]
  }

  dynamo.getItem(params, function processClientSecrets(err, data) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Drive API.
    var credentials = JSON.parse(data['Item']['value']['S']);
    callback(null, credentials);
  });
};

function evaluateCredentials(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  callback(null, oauth2Client);
};

function setTokenIntoClient(oauth2Client, callback) {
  var params = {
    TableName: 'oauth',
    Key: { provider: { S: 'google-sheets' } },
    AttributesToGet: [ 'provider', 'token' ]
  }

  dynamo.getItem(params, function(err, tokenData) {
    if(err) { console.log('TOKEN IS UNAVAILABLE'); }
    else {
      var parsedToken = JSON.parse(tokenData['Item']['token']['S']);
      oauth2Client.credentials = parsedToken;
      callback(null, oauth2Client);
    }
  });
};

function initializeGoogleUrlClient(callback) {
  var params = {
    TableName: 'oauth',
    Key: { provider: { S: 'google-url' } },
    AttributesToGet: [ 'provider', 'key' ]
  }

  dynamo.getItem(params, function(err, apiData) {
    if(err) { console.log('KEY IS UNAVAILABLE'); }
    else {
      var parsedKey = JSON.parse(apiData['Item']['key']['S']);
      var googleUrlClient = new GoogleUrl(parsedKey);
      callback(null, googleUrlClient);
    }
  });
};

// --------------------------------------------------------------------------------

// ********************* GOOGLE SPREADSHEET AUTH REQUESTS *************************

function getInfoFromSpreadsheet(oauth, name, callback) {
  doc.spreadsheets.values.get({
    auth: oauth,
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A1:I',
  }, function(err, response) {
    if(err) {
      console.log(err)
    } else {
      var rows = response.values;
      if (rows.length == 0) { console.log('NO DATA FOUND!'); }
      else {
        var mapperName = name.toLowerCase();
        var userIndex = nameIndexMapper[mapperName];
        for(var i = 0; i < rows.length; i++) {
          var row = rows[i];
          console.log('%s, %s', row[0], row[userIndex]);
        }
      }
    }
  });
};

function getRowsFromSpreadsheet(oauth, callback) {
  doc.spreadsheets.values.get({
    auth: oauth,
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A1:R',
  }, function(err, response) {
    if(err) { console.log(err) }
    else {
      var rows = response.values;
      if (rows.length == 0) { console.log('NO DATA FOUND!'); }
      else { callback(null, oauth, rows); }
    }
  });
};


function updateRowsIntoSpreadsheet(oauth, rows, args, callback) {
  var requestBody = updateRequestBody(rows, args);

  doc.spreadsheets.values.batchUpdate({
    auth: oauth,
    spreadsheetId: SPREADSHEET_ID,
    resource: requestBody
  }, function(err, response) {
    if(err) { console.log(err); }
    else {
      callback(null, response);
    }
  });
};


function shortenURL(originalURL, callback) {
  initializeGoogleUrlClient(function(err, googleUrlClient) {
    googleUrlClient.shorten(originalURL, callback);
  });
};

// *************************** HELPER FUNCTIONS *********************************

/**
  * Get the current Date and compare it to the latest date from our spreadsheet
**/
function isLatestDateCurrent(rows) {
  var latestSheetDate = rows[rows.length -1][0];

  if (getCurrentDate() == latestSheetDate) {
    return true;
  } else {
    console.log("DATES DON'T MATCH!");
    console.log("Date object: %s", new Date());
    console.log("Current Date: %s", getCurrentDate());
    console.log("latestSheetDate: %s", latestSheetDate);
    return false;
  }
}

function getCurrentDate() {
  var offset = 420 * 60000; // This is used for PDT timezone
  var date = new Date();
  var offsetDate = new Date(date.getTime() - offset);
  return (offsetDate.getUTCMonth() + 1) + "/" + offsetDate.getUTCDate() + "/" + offsetDate.getUTCFullYear();
}

function getLastRowIndex(rows) {
  if(isLatestDateCurrent(rows)) { return (rows.length + 1); }
  return rows.length + 2;
}

/**
  * Outputs a random 6 char hex representation of a colour
**/
function getRandomColour() {
  var letters = '0123456789ABCDEF';
  var color = '';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


/**
  * This will generate a particular set of data points for a specific user
  * If the connected flag is set to true then it will set all 'undefined' values to the previously seen value
  * (which are data points missed -> person skipped that plank day)
  *
  * Input:
  *       1) userIndex: 1
  *       2) data: [ ['Date', 'mexTaco', 'pierogi'] ['1/1/2016', 10, 20], ['1/2/2016', 30, 20]]
  *       3) connected: false
  * Output:
  *       { maxTime: 30, mexTaco: [10, 30] }
**/
function parseChartDataForUser(userIndex, data, connected) {
  var time, userData = {}, timeArray = [];
  var user = data[0][userIndex];
  var lastKnownTime = undefined;
  var maxTime = 0;

  for (var i =1; i < data.length; i++) {
    time = data[i][userIndex];

    // Sanitize the time if its not defined and we want to connect missing days
    if(!time && lastKnownTime && connected) { time = lastKnownTime }
    else if(time) {
      maxTime = Math.max(maxTime, time);
      lastKnownTime = time;
    }

    timeArray.push(time);
  }
  userData[user] = timeArray;
  userData['maxTime'] = maxTime;

  return userData;
}

/**
  * Will accumulate each person's data and parse it into a format that the GoogleChart object can easily render with
  * Input:
  *       1) data: [ ['Date', 'mexTaco', 'pierogi'] ['1/1/2016', 10, 20], ['1/2/2016', 30, 20]]
  *       2) callback
  * Output:
  *       { maxTime: 30, mexTaco: [10, 30], pierogi: [20, 20] } -> into callback
**/
function parseChartData(data, callback) {
  var labelRow = data[0];
  var parsedChartData = {};
  var maxTime = 0;

  for(var userIndex =1; userIndex < labelRow.length; userIndex++) {
    var parsedUserData = parseChartDataForUser(userIndex, data, true);
    var userName = data[0][userIndex];

    maxTime = Math.max(maxTime, parsedUserData.maxTime);
    parsedChartData[userName] = parsedUserData[userName];
  }
  parsedChartData.maxTime = maxTime;

  callback(null, parsedChartData);
}

/**
  * Will accumulate each person's data and parse it into a format that the GoogleChart object can easily render with
  * Input:
  *       1) data: [ ['Date', 'mexTaco', 'pierogi', 'hotSauce'] ['1/1/2016', 10, 20, 30], ['1/2/2016', 30, 20, 40]]
  *       2) filters: ['mexTaco', 'hotSauce']
  *       3) callback
  * Output:
  *       { maxTime: 40, mexTaco: [10, 30], hotSauce: [30, 40] } -> into callback
**/
function parseChartDataWithFilters(data, filters, callback) {
  var labelRow = data[0];
  var parsedChartData = {};
  var maxTime = 0;

  for(var i in filters) {
    var userIndex = filters[i];
    var parsedUserData = parseChartDataForUser(userIndex, data, true);
    var userName = data[0][userIndex];

    maxTime = Math.max(maxTime, parsedUserData.maxTime);
    parsedChartData[userName] = parsedUserData[userName];
  }
  parsedChartData.maxTime = maxTime;
  callback(null, parsedChartData);
}

/**
 * Fetch token and then set it to disk.
 *
 * @param {Object} token The token to store to disk.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
}

/*
  ARGs should come in the format:
  {
    mang: num,
    mang: num,
    womang: num
  }
*/

function updateRequestBody(rows, args) {
  var lastRowIndex = getLastRowIndex(rows);
  var dateHash = {
    majorDimension: "COLUMNS",
    range: "Sheet1!A" + lastRowIndex,
    values: [[getCurrentDate()]]
  };

  var data = [dateHash];

  for(var name in args) {
    var username = name.toLowerCase();
    if(nameLetterMapper.hasOwnProperty(username)) {
      var userLetter = nameLetterMapper[username];

      var userDataHash = {
        majorDimension: "COLUMNS",
        range: "Sheet1!" + userLetter + lastRowIndex,
        values: [[args[name]]]
      };

      data.push(userDataHash);
    }
  }
  return { valueInputOption: "USER_ENTERED", data: data };
}

/*
* This should parse out the raw data and return the array of indexes corresponding to each filter name
* Input: ['not_found', 'dude_found', 'your_mom_found']
* Output:
*         {
*           not_found: undefined,
*           dude_found: 1,
*           your_mom_found: 13
*         }
*/

function extractUserIndexes(rows, filters) {
  var userRows = rows[0];
  var extractedUserIndexes = [];

  for(var i = 0; i < userRows.length; i++) {
    var name = userRows[i].toLowerCase();

    if(_.contains(filters, name)) {
      extractedUserIndexes.push(i);
    }
  }

  return extractedUserIndexes;
}


/**
  * Generates the unshortened url-parameterized chart link from the parsed data
  * Input: 1) { maxTime: 30, dude: [10, 20, 30], whiteMang: [10, 20, 30] }
  *        2)  callback
  * Output: { 'http://go.og.l/1231297#whatthefucklinkisthis' } -> into callback
**/
function generateChartURL(parsedRows, callback) {
  var googleChart = new GoogleChart(parsedRows);
  try {
    var chartURL = googleChart.generateEncodedChartURL();
    callback(null, chartURL);
  } catch (err){
    console.log(err);
  }
};

// ****************************************************************************

class GoogleSheet {
  constructor() { }

  get(args) {
    var name = args[0].trim();

    return new Promise(function(resolve, reject) {
      async.waterfall([
          function(callback){
            readCredentials(callback);
          },
          function(credentials, callback) {
            evaluateCredentials(credentials, callback);
          },
          function(oauth2Client, callback) {
            setTokenIntoClient(oauth2Client, callback);
          },
          function(oauth, callback) {
            getInfoFromSpreadsheet(oauth, name, callback);
          }
        ],
        function finalCallback(err, data) {
          if (err) { reject(err); }
          else { resolve(data) }
      });
    });
  }

  chart(users) {
    return new Promise(function(resolve, reject) {
      async.waterfall([
          function(callback){
            readCredentials(callback);
          },
          function(credentials, callback) {
            evaluateCredentials(credentials, callback);
          },
          function(oauth2Client, callback) {
            setTokenIntoClient(oauth2Client, callback);
          },
          function(oauth, callback) {
            getRowsFromSpreadsheet(oauth, callback);
          },
          function(oauth, rows, callback) {
            var userFilters = extractUserIndexes(rows, users);

            if(userFilters.length > 0) {
              parseChartDataWithFilters(rows, userFilters, callback);
            } else {
              parseChartData(rows, callback);
            }
          },
          function(parsedRows, callback) {
            generateChartURL(parsedRows, callback);
          },
          function(googleChartURL, callback) {
            shortenURL(googleChartURL, callback);
          }
        ],
        function finalCallback(err, url) {
          if (err) { console.log(err); reject(err); }
          else { console.log(url); resolve(url); }
      });
    });
  }

  update(args) {
    return new Promise(function(resolve, reject) {
      async.waterfall([
          function(callback){
            readCredentials(callback);
          },
          function(credentials, callback) {
            evaluateCredentials(credentials, callback);
          },
          function(oauth2Client, callback) {
            setTokenIntoClient(oauth2Client, callback);
          },
          function(oauth, callback) {
            getRowsFromSpreadsheet(oauth, callback);
          },
          function(oauth, rows, callback) {
            updateRowsIntoSpreadsheet(oauth, rows, args, callback);
          }
        ],
        function finalCallback(err, data) {
          if (err) { reject(err); }
          else { resolve(data); }
      });
    });
  }
}

//  ************************ GOOGLE CHART *******************************
/*
  This class should be initialized with chart data
  {
    maxTime: maximum value over all user times
    dude: [array of values],
    dudester: [array of values],
    dudette: [array of values]
  },
  ['dude', 'dudester', 'dudette']
*/
class GoogleChart {
  constructor(chartData, filters) {
    this.chartData = chartData;
    this.maxTime = chartData.maxTime;
    this.filters = filters;
    delete chartData.maxTime;
  }

  generateChartColours() {
    var colours = [];
    for(var key in this.chartData) {
      if(this.chartData.hasOwnProperty(key)) {
        var colour = getRandomColour();
        colours.push(colour);
      }
    }

    var chartColoursString = "chco=" + colours.join(',');
    return chartColoursString;
  }

  generateInterpolatedChartData() {
    var dataStringSet = [];


  }

  generateEncodedChartData() {
    var dataStringSet = [];

    // iterate over each set of data
    for(var key in this.chartData) {
      if(this.chartData.hasOwnProperty(key)) {
        var encodedDataString = this.simpleEncode(this.chartData[key], this.maxTime);
        dataStringSet.push(encodedDataString);
      }
    }
    var chartData = "chd=s:" + dataStringSet.join(',');
    var chartAxisRange = "chxr=0,0," + this.maxTime;

    return [chartData, chartAxisRange].join('&');
  }

  generatePlainChartData() {
    var dataStringSet = [];

    // iterate over each set of data
    for(var key in this.chartData) {
      if(this.chartData.hasOwnProperty(key)) {
        dataStringSet.push(this.chartData[key].join(','));
      }
    }
    var chartData = "chd=t:" + dataStringSet.join('%7C');
    var chartAxisRange = "chxr=0,0," + (this.maxTime * 1.2);

    return [chartData, chartAxisRange].join('&');
  }
  generateChartLabels() {
    var chartLabels = [];

    for(var key in this.chartData) {
      if(this.chartData.hasOwnProperty(key)) {
        chartLabels.push(key);
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
}

var a = { maxTime: 60, dude: [10 ,20, 30], dudester: [20,40,60] }

//module.exports = new GoogleChart(a);
module.exports = new GoogleSheet();

