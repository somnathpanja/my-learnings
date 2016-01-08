var express = require('express'),
  request = require('request'),
  expressJSON = require('express-json'),
  pdfDocument = require('pdfkit'),
  LineWrapper = require('./../../node_modules/pdfkit/js/line_wrapper');

var getLineHeight = function (doc, str, options) {
  var maxHeight = options.maxHeight ? options.maxHeight : 100;
  var height = 0;

  var line = function () {
    return height += this.currentLineHeight(true);
  };
  var wrapper = new LineWrapper(doc, options);
  wrapper.on('line', line.bind(doc));
  wrapper.wrap(str, options);

  if (height > maxHeight) {
    return maxHeight;
  } else {
    return height;
  }
};

// Start Express
var app = express();

// Use JSON in POST body
app.use(expressJSON());

// Setup POST response
app.get('/post_pdf', function (req, res) {

  // Create PDF
  var doc = new pdfDocument({
    size:'A4',
    layout: 'portrait', // can be 'landscape'
    margins: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50
    },
    info: {
      Title: 'title',
      Author: 'cnMaestro', // the name of the author
      Subject: '', // the subject of the document
      Keywords: 'pdf;javascript', // keywords associated with the document
      CreationDate: 'DD/MM/YYYY', // the date the document was created (added automatically by PDFKit)
      ModDate: 'DD/MM/YYYY' // the date the document was last modified
    }
  });

// Write headers
  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Access-Control-Allow-Origin': '*',
    'Content-Disposition': 'attachment; filename=Untitled.pdf'
  });

// Pipe generated PDF into response
  doc.pipe(res);
  var idx = 0;
  var fource2Stream = function () {
    idx++;
    if (idx >= 2) {
      doc.end();
      return;
    }

    var str = 'Some text with an embedded font!';
    var options = {
      lineBreak: true,
      width: 50,
      ellipsis: true
    };

    //var x = doc.fontSize(25)
    //  .text('Some text with an embedded font!', 100, 100);

    //
    doc.text(str, options);
    doc.widthOfString(str, options);
    doc.text(getLineHeight (doc, str, options),0,0);
    doc.text(doc.page.width);
    //
    //doc.addPage();
    //doc.text('Hello world!', 100, 100);
    //
    //doc.addPage();
    //doc.text('Hello world!', 100, 100);
    //
    //doc.flushPages();
    setTimeout(fource2Stream, 5000);
  };

  fource2Stream();
});

app.listen(8080);