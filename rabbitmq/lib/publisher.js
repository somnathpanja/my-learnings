var amqp = require('amqp');
var RABBIT_CONF = require('./../conf.json');
var NO_OF_MSG_PER_SEC = 10000;

var hostName = process.argv[2] ? process.argv[2] : "A";
var rabbitHostName = process.argv[3];

if (!rabbitHostName)
  rabbitHostName = "rabbit-elb";
var data = require('./data.js');
var connection = amqp.createConnection(RABBIT_CONF[rabbitHostName]);

var messageIndex = 0;
// Wait for connection to become established.
connection.on('ready', function () {
  //connection.exchange

  var publish = function (message) {
    var i = 1;
    var date = (new Date()).toUTCString();
    for (; i <= NO_OF_MSG_PER_SEC; i++) {
      connection.publish("my-queue", {host: hostName, msg_index: messageIndex, data: data}, {}, function (ex) {
        console.log(ex);
      });

      messageIndex++;
    }

    console.log(date + '- No of message sent: ' + messageIndex);

    if (i == NO_OF_MSG_PER_SEC + 1)
      setTimeout(publish, 1000);
  };

  setTimeout(publish, 1000);
});