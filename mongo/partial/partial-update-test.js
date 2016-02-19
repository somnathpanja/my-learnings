var MongoClient = require('mongodb').MongoClient
  , assert = require('assert'),
  sampleStats = require('./sample-stats').stats(),
  DateHelper = require('./date-rounding');

// Connection URL 
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server 
MongoClient.connect(url, function (err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  var collection = db.collection('insert-test');
  collection.createIndex({mac: 1, ts: 1}, {unique: true}, function () {
    doInsertNRecords(db, function () {
      console.log("Done..");
    });
  });
});

var doInsertNRecords = function (db, cb) {
  var TOTAL_COUNT = 10000, count = 0;
  var startTs = Date.now();

  var insert = function (cb) {
    if (count > TOTAL_COUNT) {

      db.close();
      console.log("TotalTime=", ((Date.now() - startTs) / 1000), " to update ", TOTAL_COUNT, " records");
      cb.apply();
      return;
    }

    count++;
    updateDocuments(db, count, function () {
      insert(cb);
    });
  };

  insert(cb);
};

var sampleTs = 1453966865586.0000;
var updateDocuments = function (db, index, callback) {
  // Get the documents collection
  var collection = db.collection('insert-test');

  var dateNow = new Date(sampleTs);
  var selector = {mac: "CC:CC:CC:CC:CC" + index, ts: DateHelper.getLastHourDT(dateNow)};

  var updateData = {
    $set: {
      "stats.A.samples.1": 10,
      "stats.B.samples.1": 10,
      "stats.C.samples.1": 10,
      "stats.D.samples.1": 10,
      "stats.E.samples.1": 10
    },
    $inc: {
      "stats.A.count": 1, "stats.A.sum": 10,
      "stats.B.count": 1, "stats.B.sum": 10,
      "stats.C.count": 1, "stats.C.sum": 10,
      "stats.D.count": 1, "stats.D.sum": 10,
      "stats.E.count": 1, "stats.E.sum": 10
    },
    $max: {
      "stats.A.max": 10,
      "stats.B.max": 10,
      "stats.C.max": 10,
      "stats.D.max": 10,
      "stats.E.max": 10
    },
    $min: {
      "stats.A.min": 10,
      "stats.B.min": 10,
      "stats.C.min": 10,
      "stats.D.min": 10,
      "stats.E.min": 10
    },
    $currentDate: {
      lastModified: true
    }
  };

  collection.update(selector, updateData, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }

    console.log("Updated 1 doc");
    callback();
  });
};