var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL 
var url = 'mongodb://localhost:27017/stats';
// Use connect method to connect to the Server 
MongoClient.connect(url, function (err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  var collection = db.collection('IND.stats.hours');
  var duration = 4;
  var intervalType = 'days';
  var ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
  var targetTs = Date.now() - 4 * ONE_DAY_IN_MS;
  collection.find({mac: "C1:00:0A:00:00:58", ts: {$gt: duration}}, {_id: 0, mac: 1, ts: 1, "wl.ul.kbitsRate" : 1}).sort({"ts": 1})
    .aggregate([{
        $group:{ "wl.ul.kbitsRate": 1 }
    }])
    .each(function (err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      doc.ts = new Date(doc.ts).toGMTString();
      console.dir(doc);
    } else {
      console.log('Completed');
    }
  });

  //collection.find({a:1}).aggregate([
  //  { "$project": {
  //    "_id": 0,
  //    "consname": "$username"
  //  }}
  //]);

  //db.test.aggregate([
  //  {
  //    $project: {
  //      score: {
  //        $cond: [
  //          {$lt: ['$distances.big', '$distances.medium']}, // boolean expression
  //          '$distances.big',   // true case
  //          '$distances.medium' // false case
  //        ]
  //      }
  //    }
  //  },
  //  {$sort: {score: 1}}
  //])

  //collection.aggregate({
  //  "$project": {
  //    "_id": 0,
  //    "status" : {
  //      $cond: [
  //        {$eq:["$a", 1]}, "On", "Off"
  //      ]
  //    }
  //  }
  //}, function (err, docs) {
  //  //assert.equal(err, null);
  //  //assert.equal(2, docs.length);
  //  console.log("Found the following records");
  //  console.dir(docs);
  //
  //  db.close();
  //});

  //collection.find({a:1}).toArray(function(err, docs) {
  //  assert.equal(err, null);
  //  assert.equal(2, docs.length);
  //  console.log("Found the following records");
  //  console.dir(docs);
  //
  //  db.close();
  //});


  //
  //insertDocuments(db, function () {
  //  db.close();
  //});
});
//
//var insertDocuments = function (db, callback) {
//  // Get the documents collection
//  var collection = db.collection('documents');
//  // Insert some documents
//  collection.createIndex({firstname: 1, firstname: 1}, {unique: true}, function () {
//    collection.insertMany([
//      {firstname: "somnath"}, {lastname: "panja"}
//    ], function (err, result) {
//      if (err.code == 11000) {
//        console.log("Duplicate error", err);
//      }
//      // assert.equal(err, null);
//      // assert.equal(3, result.result.n);
//      // assert.equal(3, result.ops.length);
//      console.log("Inserted 3 documents into the document collection");
//      callback(result);
//    });
//  });
//};