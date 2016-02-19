var express = require('express');

// Start Express
var app = express();

// Setup POST response
app.get('/hitme', function (req, res) {
  // Write headers
  //res.writeHead(200, {
  //  'Content-Type': 'text/html'
  //});

  setTimeout(function () {
    //res.send("Hello oky fine");
  }, 1200);
});

app.listen(8080);