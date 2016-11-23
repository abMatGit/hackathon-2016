'use strict';

var googleAuth = require('google-auth-library');
var google = require('googleapis');
var AWS = require('aws-sdk');
var async = require('async');
var dynamo = new AWS.DynamoDB({ region: 'us-east-1' });
var _= require('underscore');

var nameIndexMapper = require('../../../configs/user_mappings').nameIndexMapper;
var nameLetterMapper = require('../../../configs/user_mappings').nameLetterMapper;
var SPREADSHEET_ID= require('../../../configs/google_credentials').spreadsheetId;
var SCOPES = [  'https://www.googleapis.com/auth/spreadsheets' ];

var doc = google.sheets('v4');

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

function getInfoFromSpreadsheet(oauth, name, callback) {
  doc.spreadsheets.values.get({
    auth: oauth,
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A2:I',
  }, function(err, response) {
    if(err) {
      console.log(err)
    } else {
      var rows = response.values;
      if (rows.length == 0) { console.log('NO DATA FOUND!'); }
      else {
        console.log('Date, %s:', name);
        var userIndex = nameIndexMapper[name];
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
    range: 'Sheet1!A2:R',
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

function getRandomColour() {
  var letters = '0123456789ABCDEF';
  var color = '';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
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

// ****************************************************************************

class GoogleSheet {
  constructor() { }

  get(args) {
    var name = args[0];

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
    dude: [array of values],
    dudester: [array of values],
    dudette: [array of values]
  }
*/
class GoogleChart {
  constructor(chartData) {
    this.chartData = chartData;
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

  generateChartData() {
    var dataStringSet = [];

    // iterate over each set of data
    for(var key in this.chartData) {
      if(this.chartData.hasOwnProperty(key)) {
        dataStringSet.push(this.chartData[key].join(','));
      }
    }
    return "chd=t:" + dataStringSet.join('%7C');
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
    return "cht=ls"
  }

  generateChartURL(){
    var chartArguments = [
      this.generateChartColours(),
      this.generateChartData(),
      this.generateChartLabels(),
      this.generateChartSize(),
      this.generateChartType()
    ]

    return "https://chart.apis.google.com/chart?" + chartArguments.join('&');
  }
}

class GoogleURLShortener {
}

var a = { dude: [10 ,20, 30], dudester: [20,40,60] }

module.exports = new GoogleChart(a);
