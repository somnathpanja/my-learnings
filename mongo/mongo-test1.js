var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL 
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server 
MongoClient.connect(url, function (err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  var collection = db.collection('documents');

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

  collection.aggregate({
    "$project": {
      "_id": 0,
      "status" : {
        $cond: [
          {$eq:["$a", 1]}, "On", "Off"
        ]
      }
    }
  }, function (err, docs) {
    //assert.equal(err, null);
    //assert.equal(2, docs.length);
    console.log("Found the following records");
    console.dir(docs);

    db.close();
  });

  //collection.find({a:1}).toArray(function(err, docs) {
  //  assert.equal(err, null);
  //  assert.equal(2, docs.length);
  //  console.log("Found the following records");
  //  console.dir(docs);
  //
  //  db.close();
  //});


  //
  insertDocuments(db, function () {
    db.close();
  });
});

var insertDocuments = function (db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.createIndex({firstname: 1, firstname: 1}, {unique: true}, function () {
    collection.insertMany([
      {firstname: "somnath"}, {lastname: "panja"}
    ], function (err, result) {
      if (err.code == 11000) {
        console.log("Duplicate error", err);
      }
      // assert.equal(err, null);
      // assert.equal(3, result.result.n);
      // assert.equal(3, result.ops.length);
      console.log("Inserted 3 documents into the document collection");
      callback(result);
    });
  });
};