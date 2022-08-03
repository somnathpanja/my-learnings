
var doc = {
  ts:1212121212, name: "somnath", roll:1, subject: "math"
};

var i = 1;
// Connection URL
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';
// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  console.log("Connected correctly to server");

  var collection = db.collection('somnath');
  var insert = function() {
    i++;
    if(i> 2){
      console.log("done...");
      return;
    }
    doc._id = i;
    doc.mac = i + "C1:00:0A:00:00:29";
    doc.nid = "Delhi" + i;
    doc.tid = "Delhi Industrial"+i;
    doc.eType = "Falcon"+i;
    collection.update({ts:1212121212, name : {$in:['somnath', 'm2']}}, {$set: {ts:1111, a:{}, b:{}}}, {multi: true}, function (err, result) {
      if (err) {
        console.log(err);
        insert();
        return;
      }

      console.log("Inserted 1 doc", i);

      insert();

    });
  };
  collection.createIndex({mac: 1}, {unique: true}, function () {
    insert();
  });
});
