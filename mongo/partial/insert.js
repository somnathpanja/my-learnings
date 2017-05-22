
var doc = {
  "eType" : "ePMP",
  "mac" : "C1:00:0A:00:00:29",
  "nid" : "Delhi",
  "tid" : "Delhi Industrial",
  "loc" : {
    "type" : "Point",
    "coordinates" : [
      77.1519887706174643,
      28.5850130963672235
    ],
    "gps" : [
      77.6951629999999938,
      12.9474160000000005
    ]
  },
  "alarms" : {
    "minor" : 1,
    "major" : 1,
    "critical" : 0,
    "max" : {
      "critical" : 0,
      "major" : 1,
      "minor" : 1,
      "ts" : 1461675031819.0000000000000000
    }
  },
  "mode" : "ap",
  "model" : "1000",
  "pmac" : "",
  "isMgd" : true,
  "info" : {
    "radio" : {
      "dlPktLossPer" : 13.0953996471705807,
      "ulPktLossPer" : 13.0155695165255416,
      "dlErrPktsPer" : 3.7725607273714203,
      "ulErrPktsPer" : 28.5714285714285694,
      "dlCapDropPktsPer" : 63.2183908045977034,
      "ulCapDropPktsPer" : 10.0109259765091512,
      "ulSNR" : 31,
      "rfFreq" : 5550,
      "txPower" : 960,
      "dropCount" : 1,
      "dfsSts" : 5,
      "dfsCnt" : 2,
      "ulMCS" : 5,
      "dlMCS" : 14,
      "chWidth" : 4,
      "ulTPut" : 0.1733200000000000,
      "dlTPut" : 0.1566500000000000,
      "ulBitsRx" : 1247,
      "dlBitsTx" : 1664,
      "ulPkts" : 49,
      "dlCapDropPkts" : 55,
      "ulErrPkts" : 12,
      "ulCapDropPkts" : 77,
      "dlPkts" : 29,
      "dlErrPkts" : 93,
      "dlRetransPkts" : 5,
      "dlRetransPktsPer" : 0.1525682319037125
    },
    "sn" : "SN-C1:00:0A:00:00:29",
    "sys" : {
      "date" : 1461674980563.0000000000000000,
      "reboots" : 7,
      "reset" : 1459243172951.0000000000000000,
      "upTime" : 1461674613932.0000000000000000,
      "prodName" : "ePMP 1000",
      "online" : false,
      "nosta" : 5,
      "dnTime" : 1461675031819.0000000000000000
    },
    "cfg" : {
      "name" : "Delhi Industrial North",
      "ver" : null,
      "ssid" : "Wireless-82",
      "country" : "us",
      "gain" : 41,
      "tddRatio" : 1,
      "authType" : 2,
      "desc" : "",
      "maxsta" : 10,
      "maxrange" : 26
    },
    "sct" : {
      "attempts" : 3,
      "success" : 13,
      "fail" : 6
    },
    "net" : {
      "mode" : 31,
      "ln2mode" : 8,
      "status" : 1,
      "ln2status" : 1,
      "ip" : "116.189.157.132",
      "modeNspeed" : 56,
      "ln2modeNspeed" : 67,
      "wlInterface" : 0,
      "wlMac" : "A0-B0-C0-08-89-73",
      "wan" : "229.230.137.34",
      "gwip" : "236.138.180.217",
      "dnsip" : "186.184.85.33",
      "mask" : "47.214.155.181"
    },
    "mgmt" : {
      "hw" : "3",
      "actSw" : "1.0.4",
      "inSw" : "1.0.2",
      "cfgSts" : "0:2016-03-15 12:37:13",
      "hwWarr" : "2016-03-15 12:37:13",
      "advRepl" : null,
      "feats" : null,
      "vlan" : 0,
      "bridge" : "STA",
      "lastUpd" : [],
      "lastCfg" : [],
      "da" : "1.0.1"
    },
    "gps" : {
      "fw" : "1.0.4",
      "height" : 28,
      "time" : 1461674900167.0000000000000000,
      "numTracked" : 5411,
      "numVisible" : 8560,
      "syncState" : 2
    },
    "onboarding" : {
      "state" : 5,
      "lastTS" : 1458045433933.0000000000000000,
      "swState" : 3,
      "swMsg" : null,
      "cfgState" : 2,
      "cfgMsg" : null,
      "userId" : null,
      "flag" : true,
      "cambiumId" : "IND",
      "mode" : null
    },
    "lstUpd" : 1461675013966.0000000000000000
  }
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
    collection.update({ts:1111, mac : {$in:['m1', 'm2']}}, {$set: {ts:1111, a:{}, b:{}}}, {multi: true}, function (err, result) {
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
