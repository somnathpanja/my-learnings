var amqp = require('amqp');
var RABBIT_CONF = require('./../conf.json');
process.title = "subscriber";
var rabbitHostName = process.argv[2];

if (!rabbitHostName)
  rabbitHostName = "rabbit-elb";

var connection = amqp.createConnection(RABBIT_CONF[rabbitHostName]);
var settings = require('./qSetting.json');
// Wait for connection to become established.
connection.on('ready', function () {
  // Use the default 'amq.topic' exchange
  connection.queue('my-queue', settings.q, function (q) {
    // Catch all messages
    q.bind('#');

    // Receive messages
    q.subscribe(settings.subscriber, function (dataObj, headers, deliveryInfo, ack) {
      //  var msg = JSON.stringify(data);
      // Print messages to stdout
      var date = (new Date()).toUTCString();
      console.log(date + "- A new message came-" + dataObj.host + dataObj.msg_index + "(P-" + dataObj.priority + ")");
      setTimeout(function () {
        console.log(date + " - Just finished processing : " + dataObj.host + dataObj.msg_index);
        ack.acknowledge();
      }, 1000);
    });
  });
})
;