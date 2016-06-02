var express = require('express'),
  request = require('request'),
  CSVDoc = require('./../lib/csvDoc');

var table;
// Start Express
var app = express();

// Use JSON in POST body
//app.use(expressJSON());

// Setup POST response
app.get('/report/inventory/csv', function (req, res) {
  // Write headers
  res.writeHead(200, {
    'Content-Type': 'text/csv',
    'Access-Control-Allow-Origin': '*',
    'Content-Disposition': 'attachment; filename=inventory.csv'
  });

  createCSVAndStream(req, res);
});

app.listen(8080);

var createCSVAndStream = function (req, res) {

  var csv = new CSVDoc(res, ["column1", "column2", "column3", "column4"]);
  csv.startRender();

  var mongoHitCount = 0;

  var addRowDataOnTheFly = function () {
    if (mongoHitCount > 600000) {
      csv.end();
      return;
    }

    console.log(mongoHitCount + ' > iteration');

    getDataFromMongo(mongoHitCount, function (err, rows) {
      rows.forEach(function (row) {
        csv.renderRow(row);
        console.log(row);
      });

      mongoHitCount++;
      setTimeout(addRowDataOnTheFly, 1000);
    });
  };

  addRowDataOnTheFly();
};

var getDataFromMongo = function (hitCount, cb) {
  var noOfColumns = 4;
  var recCount = 10;
  var rows = [];
  var idx = (recCount * hitCount) + 1;
  for (; idx <= (recCount * hitCount) + recCount; idx++) {
    var row = [];
    for (var col = 0; col < 4; col++) {
      row.push('Data(' + [idx, col].join(',') + ')');
    }

    rows.push(row);
  }

  setTimeout(function () {
    cb(null, rows)
  }, 100);
};