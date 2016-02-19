var MongoClient = require('mongodb').MongoClient
  , assert = require('assert'),
  sampleStats = require('./sample-stats').stats();

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
    updateDocuments(db, function () {
      insert(cb);
    });
  };

  insert(cb);
};

var sampleTs = 1453966865586;
var updateDocuments = function (db, callback) {
  // Get the documents collection
  var collection = db.collection('insert-test');
  // Insert some documents
  var selector = {mac: "CC:CC:CC:CC:CC", ts: sampleTs++};
  collection.update(selector, {$set: {stats: sampleStats}}, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }

    console.log("Updated 1 doc");
    callback();
  });
};