var async = require('async');
var util = require('util');

var B = function () {

};

var A = function () {

};

util.inherits(A, B);

A.prototype._printMe = function (msg) {
  console.log(msg);
};

A.prototype.go = function (msg) {
  var self = this;

  async.waterfall([function checkDeviceStatus(next) {
    self._printMe("Hi", next);
  },
    function (callback) {
      callback(null, 'one', 'two');
    },
    function (arg1, arg2, callback) {
      // arg1 now equals 'one' and arg2 now equals 'two'
      callback(null, 'three');
    },
    function (arg1, callback) {
      // arg1 now equals 'three'
      callback(null, 'done');
    }
  ], function (err, result) {
    // result now equals 'done'
    console.log('hi');
  });
};

var a= new A();
a.go();

