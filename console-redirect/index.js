var fs = require('fs');
var path = require('path');
var util = require('util');

//
//var Console = require('console').Console;
//GLOBAL._console_ = console;
//GLOBAL._consoleToFile = new Console(stdout, stderr);

var redirectConsoleToFile = true;

function getConsole(d) { //
    return redirectConsoleToFile ? GLOBAL._consoleToFile : GLOBAL._console_;
}

//stdout.on('data', function(x,y){
//  console.err('asdasdasd');
//});

//
console.log('asdasdasd');


var checkIfReloadRequired = function(){

};

var fileExist = function (path) {
    var stats = null;
    try {
        // Query the entry
        stats = fs.statSync(path);
    } catch (e) {
        console.log(e);
        return null;
    }

    return stats;
};

var verifyForFileRotation = function (filePath) {
    var isRotated = false;
    var stats = fileExist(filePath);

    if (stats) {
        var sizeInBytes = stats.size;
        try {
            if (sizeInBytes > 0) {
                try {
                    fs.unlinkSync(filePath + 0); // Delete old file
                } catch (e) {
                }

                try {
                    fs.renameSync(filePath, filePath + 0); // rename current file
                } catch (e) {
                }

                // clear the file
                //fs.writeFile(filePath, '', function (err) {
                //    if (err) console.log(err);
                //});
                isRotated = true; // Yes rotation done, reload required
            }
        } catch (e) {
        }
    }

    return isRotated;
};


var init = function () {
    var stdout = fs.createWriteStream("./app_stdout.log", {flags: 'a'});
    var stderr = fs.createWriteStream("./app_stderr.log", {flags: 'a'});

    GLOBAL._stdoutWrite = process.stdout.write;
    process.stdout.write = function () {
        var args = Array.prototype.slice.call(arguments);
        if (redirectConsoleToFile)
            stdout.write.apply(stdout, args);
        else
            GLOBAL._stdoutWrite.apply(process.stdout, args);
    };

    GLOBAL._stderrWrite = process.stdout.write;
    process.stderr.write = function () {
        var args = Array.prototype.slice.call(arguments);
        if (redirectConsoleToFile)
            stdout.write.apply(stdout, args);
        else
            GLOBAL._stderrWrite.apply(process.stderr, args);
    };

};

init();

//process.__defineGetter__('stdout', function () {
//  return stdout;
//});
//
//process.__defineGetter__('stderr', function () {
//  return stderr;
//});
//
//process.__defineGetter__('stdout', function () {
//  return stdout;
//});
//
//process.__defineGetter__('stderr', function () {
//  return stderr;
//});

var index = 0;
var print = function () {
    console.log("Hi" + index++);
    setTimeout(function () {
        print();
        fileExist('./app_stdout.log');
    }, 1000);
};

setTimeout(function () {
    print();
}, 1000);