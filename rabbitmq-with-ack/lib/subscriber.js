var amqp = require('amqp');
var RABBIT_CONF = require('./../conf.json');
var FileWrite = require('./../../common/file-writer');
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

      if (isLockExist()) {
        doReject(dataObj, headers, deliveryInfo, ack);
        return;
      }

      setLock(function () {
        var date = (new Date()).toUTCString();
        console.log(date + "- A new message came-" + dataObj.host + dataObj.msg_index + "(P-" + dataObj.priority + ")");
        setTimeout(function () {
          console.log(date + " - Just finished processing : " + dataObj.host + dataObj.msg_index);
          removeLock(function () {
            ack.acknowledge();
          });
        }, 1000);
      })
    });
  });
});

var doReject = function (dataObj, headers, deliveryInfo, ack) {
  //console.log(deliveryInfo);
  connection.publish("my-queue", dataObj, {priority: 1, immediate:true}, function (ex) {
    console.log(ex);
  });
  ack.reject(false);
};

var lockFile = '/home/user1/my-learnings/rabbitmq-with-ack/event.lock';
var fs = require('fs');
var setLock = function (cb) {

  fs.appendFile(lockFile, '{"lock":1}', function (err) {
    if (err) throw err;
    if (cb) cb.apply(null, [err]);
  });
};

var removeLock = function (cb) {
  try {
    fs.unlinkSync(lockFile);
  } catch(e){

  }
  cb();
};

var isLockExist = function () {
  return isFileExists(lockFile);
};

var isFileExists = function (path) {
  var stats = null;
  try {
    // Query the entry
    stats = fs.statSync(path);
  } catch (e) {
    return null;
  }

  return stats;
};
