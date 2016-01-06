var fs = require('fs');
var util = require('util');
var obj = {a: "Hello world", b: 232, c: "dfsdfsdfs df", e: {a: "sdfsdfsdfsfdsfsfsfsdfsfsfsdsfsdfsdf", b: "sdfs" , c : "sdfsd", d: "sdfsdf"}};

var entryCount1 = 0;
var entryCount2 = 0;
var MAX_LINES = 40000;

var write2FileWithSpace = function () {
  if(entryCount1 >= MAX_LINES) return;
  var path = __dirname + "/../logs/fileWithSpace.log";
  entryCount1++;
  fs.appendFile(path, JSON.stringify(obj), function (err) {
    if (err) throw err;

    process.nextTick(function(){
      write2FileWithSpace();
    });
  });
};

var write2FileWithoutSpace = function () {
  if(entryCount2 >= MAX_LINES) return;
  var path = __dirname + "/../logs/fileWithoutSpace.log";
  entryCount2++;
  fs.appendFile(path, util.inspect(obj), function (err) {
    if (err) throw err;

    process.nextTick(function(){
      write2FileWithoutSpace();
    });
  });
};

write2FileWithoutSpace();
write2FileWithSpace();