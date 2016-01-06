var amqp = require('amqp');
var RABBIT_CONF = require('./../conf.json');

var rabbitHostName = process.argv[2];

if (!rabbitHostName)
  rabbitHostName = "rabbit-elb";

var connection = amqp.createConnection(RABBIT_CONF[rabbitHostName]);

// Wait for connection to become established.
connection.on('ready', function () {
  // Use the default 'amq.topic' exchange
  connection.queue('my-queue', function (q) {
    // Catch all messages
    q.bind('#');

    // Receive messages
    q.subscribe(function (dataObj) {
      //  var msg = JSON.stringify(data);
      // Print messages to stdout
      var date = (new Date()).toUTCString();
      console.log(date + " - No of Message received : " + dataObj.msg_index);
    });
  });
});