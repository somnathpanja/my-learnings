var amqp = require('amqp');
var RABBIT_CONF = require('./../conf.json');

var hostName = process.argv[2] ?  process.argv[2] : "A";
var rabbitHostName = process.argv[3];

if(!rabbitHostName)
    rabbitHostName = "rabbit-elb";

var connection = amqp.createConnection(RABBIT_CONF[rabbitHostName]);

var messageIndex = 0;
// Wait for connection to become established.
connection.on('ready', function () {
    var publish = function (message) {
        connection.publish("my-queue", {host: hostName, msg_index: messageIndex}, {}, function (ex) {
            console.log(ex);
        });
        messageIndex++;
        setTimeout(publish, 4000);
    };

    setTimeout(publish, 4000);
});