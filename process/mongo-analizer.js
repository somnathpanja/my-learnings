var MongoClient = require('mongodb').MongoClient;
var mongoDb = null;
var FileWriter = require('../common/file-writer');
var LOG = new FileWriter('./', 'mongo_stats.log');

var connect2Mongo = function (cb) {
  var url = 'mongodb://localhost:27017';
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log("Error while connection to Mongo", err);
      return;
    }

    mongoDb = db;
    cb(err, cb);
  });
};

var collectStats = function (db) {
  var ts = Date.now();
  LOG.write('"ts", "connections", "Memory-RSS"');
  db.command({serverStatus: 1}, function (errr, stats) {

    var momgoStats = {
      ts: ts,
      currentConnections: stats.connections.current,
      memRss: stats.mem.resident,
      memVirtual: stats.mem.virtual
    };
    var str = [ts, momgoStats.currentConnections, momgoStats.memRss].join(",");
    LOG.write(str);
    //console.log(JSON.stringify(momgoStats));
  });
};

var timer = function () {
  collectStats(mongoDb);
  setTimeout(timer, 2000);
};

connect2Mongo(function(){
  setTimeout(timer, 2000);
});

