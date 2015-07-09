/**
 * Created by somnath.panja on 7/9/2015.
 */
/**
 * Generate 3 log files randomly
 */


(function(){
    var longjohn = require('longjohn');
    longjohn.async_trace_limit = 3;
    process.name = "myapp";
    var fileWritter = require('./file-writer');
    var debugLogger = new fileWritter('/var/log/myapps', process.name + "_debug.log");

    var sampleErrorMsgs = [
        "Memory exception",
        "Max socket reached",
        "failed to write to file",
        "cant access property of undefined",
        "Failed to publish amqp",
        "Failed to connect to mongodb"
    ];

    var getRandomNumber = function(start, end){
        return Math.floor((Math.random() * end) + start);
    };

    function write2DebugLog(message, error) {
        var sampleData = {
            message: message,
            eror_code: error.code,
            err: error,
            time_ms : {
                "session" : getRandomNumber(1, 100),
                "parsing" : getRandomNumber(1, 100),
                "amqp_publish" : getRandomNumber(1, 100),
            },
            ts: Date.now(),
            ts_display: Date.now().toLocaleString(),
            status: "failed"
        };
        console.log(JSON.stringify(sampleData));
        debugLogger.write(sampleData);
    }

    var taskA = function(cb){
        process.nextTick(function(){
            console.log('Im doing task A');
            taskB(function(){
                cb.apply(null, [null]);
            });
        });
    };

    var taskB = function(cb){
        process.nextTick(function(){
            console.log('Im doing task B');
            taskC(function(){
                cb.apply(null, [null]);
            });
        });
    };

    var taskC = function(cb){
        process.nextTick(function(){
            console.log('Im doing task C');
            throw new Error(sampleErrorMsgs[getRandomNumber(0, 5)]);
            cb.apply();
        });
    };

    (function sampleAppCode2Run(){
        setTimeout(function(){
            taskA();
            setTimeout(sampleAppCode2Run, getRandomNumber(100, 5000));
        }, 1000);
    })();

    process.on('uncaughtException', function(err) {
        write2DebugLog(err.toString(), err);
    });
})();