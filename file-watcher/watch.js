/**
 * Created by somnath.panja on 8/4/2015.
 */

var fs = require('fs');
var path = require('path');
var filePath = __dirname + path.sep + 'watchMe.json';
fs.watchFile(filePath,function (fw) {
    fs.readFile(filePath, function (err, data) {
        if (err) throw err;
        console.log(data.toString());
    });
});