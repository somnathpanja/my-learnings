var request = require('request');
var x= Date.now();

request.get('http://localhost:8080/hitme')
  .on('end', function (c) {
    console.log("Connection end event..");
  }).on('response', function (response) {
    console.log(response.statusCode); // 200
    console.log(response.headers['content-type']); // 'image/png'
  }).on('error', function (c) {
    console.log("Time in Sec" + (Date.now() - x)/1000);
    console.log("Connection error event..", c);
  });