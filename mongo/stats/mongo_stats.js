var FileWritter = require('../../common/file-writer');

var MongoClient = require('mongodb').MongoClient,
  List = require('jscollection').List;


// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  var collection = db.collection('insert-test');
  collection.createIndex({mac: 1, ts: 1}, {unique: true}, function () {
    collection.remove({}, function () {
      doInsertNRecords(db, function () {
        console.log("Done..");
      });
    });
  });
});