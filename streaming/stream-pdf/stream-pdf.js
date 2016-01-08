var express = require('express'),
  request = require('request'),
  expressJSON = require('express-json'),
  pdfDocument = require('pdfkit');

// Start Express
var app = express();

// Use JSON in POST body
app.use(expressJSON());

// Setup POST response
app.get('/post_pdf', function (req, res) {

  // Create PDF
  var doc = new pdfDocument({
    size: 'A4', //  A4: [595.28, 841.89]
    layout: 'portrait', // can be 'landscape'
    margins: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    },
    info: {
      Title: 'title',
      Author: 'author', // the name of the author
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

// Process image
  request({
    url: 'http://dummyimage.com/640.jpeg',
    encoding: null // Prevents Request from converting response to string
  }, function (err, response, body) {
    if (err) throw err;
    var idx = 0;

    var fource2Stream = function () {
      idx++;
      if (idx >= 10) {
        doc.end(); // Close document and, by extension, response
        return;
      }


      doc.addPage();
      // Inject image
      doc.image(body); // `body` is a Buffer because we told Request
                       // to not make it a string
      doc.addPage();
      doc.text('Hello world!', 100, 100);

      doc.addPage();
      doc.text('Hello world!', 100, 100);

      doc.flushPages();
      setTimeout(fource2Stream, 5000);
    };

    fource2Stream();
    return;
  });
});

app.listen(8080);