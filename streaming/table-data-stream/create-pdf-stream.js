var express = require('express'),
  PDFDoc = require('pdfkit'),
  request = require('request'),
  expressJSON = require('express-json'),
  PDF = require('./pdfDoc');
var table;
// Start Express
var app = express();

// Use JSON in POST body
app.use(expressJSON());

// Setup POST response
app.get('/report/inventory/pdf', function (req, res) {
  // Write headers
  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Access-Control-Allow-Origin': '*',
    'Content-Disposition': 'attachment; filename=Untitled.pdf'
  });

  createPDFAndStream(req, res);
});

app.listen(8080);

var createPDFAndStream = function (req, res) {
  var docSettings = {
    layout: 'portrait', // can be 'landscape'
    size: 'A4',
    margins: {top: 70, bottom: 70, left: 70, right: 70},
    info: {
      Title: 'Report for inventory | Date:' + (new Date()).toDateString(),
      Author: 'cnMaestro',        // the name of the author
      Subject: 'USA Inventory list',                // the subject of the document
      Keywords: 'pdf;inventory;' // keywords associated with the document
    }
  };

  var doc = new PDFDoc(docSettings);
  doc.pipe(res);

  doc.text("Hello title", {align:'center'});

  table = new PDF.Table(doc, doc.currentLineHeight() + doc.page.margins.top +10);
  table.columns.add(new PDF.Table.Column("Column1"), {widthInPercent: 10 });
  table.columns.add(new PDF.Table.Column("Column2"), {widthInPercent: 10 });
  table.columns.add(new PDF.Table.Column("Column3"), {widthInPercent: 80 });
  table.startRender();

  var mongoHitCount = 0;

  var addRowDataOnTheFly = function () {
    if (mongoHitCount > 2) {
      doc.end();
      return;
    }

    console.log(mongoHitCount + ' > iteration');

    getDataFromMongo(mongoHitCount, function (err, rows) {
      rows.forEach(function (row) {
        table.addRow(row);
        console.log(row);
      });

      mongoHitCount++;
      setTimeout(addRowDataOnTheFly, 1000);
    });
  };

  addRowDataOnTheFly();
};

var getDataFromMongo = function (hitCount, cb) {
  var recCount = 10;
  var rows = [];
  var idx = (recCount * hitCount) + 1;
  for (; idx <= (recCount * hitCount) + recCount; idx++) {
    var row = [];
    for (var col = 0; col < table.columns.length; col++) {
      row.push('Data(' + [idx, col].join(',') + ')');
    }

    rows.push(row);
  }

  setTimeout(function () {
    cb(null, rows)
  }, 100);
};


