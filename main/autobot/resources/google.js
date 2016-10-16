var googleAuth = require('google-auth-library');
var google = require('googleapis');
var readline = require('readline');
var async = require('async');
var fs = require('fs');
var _= require('underscore');

nameIndexMapper = require('../../../configs/user_mappings').nameIndexMapper;
nameLetterMapper = require('../../../configs/user_mappings').nameLetterMapper;
var SPREADSHEET_ID= require('../../../configs/google_credentials').spreadsheetId;
var SCOPES = [  'https://www.googleapis.com/auth/spreadsheets' ];

var TOKEN_DIR = '../../../configs/';
var TOKEN_PATH = TOKEN_DIR + 'google-sheet-oauth-token.json';

var doc = google.sheets('v4');

function readCredentials(callback) {
  fs.readFile('./configs/client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Drive API.
    var credentials = JSON.parse(content);
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
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
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
      console.log(response);
      callback(args);
    }
  });
};

// *************************** HELPER FUNCTIONS *********************************

/**
  * Get the current Date and compare it to the latest date from our spreadsheet
**/
function isLatestDateCurrent(rows) {
  var latestSheetDate = rows[rows.length -1][0];

  return getCurrentDate() == latestSheetDate;
}

function getCurrentDate() {
  var date = new Date();
  return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
}

function getLastRowIndex(rows) {
  if(isLatestDateCurrent(rows)) { return (rows.length + 1); }
  return rows.length + 2;
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
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(null, oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
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
    if(nameLetterMapper.hasOwnProperty(name)) {
      var userLetter = nameLetterMapper[name];

      userDataHash = {
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
          else { resolve(data) }
      });
    });
  }
}

module.exports = new GoogleSheet();