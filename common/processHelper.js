(function () {
  var exec = require('child_process').exec;

  var ProcessHelper = {};

  /**
   * Available command types and arguments to be sent to command function
   * @param commandType
   * @param inputs
   * @param cb
   */
  ProcessHelper.exec = function (commandType, inputs, cb) {
    var cmd = commandType.command.apply(null, inputs);
    var child = exec(cmd, function (error, stdout, stderr) {
      var outPut;
      if (error) {
        console.log('exec error: ' + error);
      } else {
        outPut = commandType.responseParser(stdout);
      }

      process.nextTick(function () {
        cb.apply(null, [error, outPut]);
      });

      child.kill();
    });
  };

  ProcessHelper.COMMANDS = {
    PROCESS_IDS_BY_PROCESS_NAME: {
      command: function (processName) {
        return "ps -ef | grep " + processName + " | grep -v 'grep' | awk {'print $2'}";
      },
      responseParser: function (str) {
        return str.trim().split('\n');
      }
    },
    CPU_MEMORY_BY_PROCESS_NAME: {
      command: function (processName) {
        // 3---cpu | 4--- memory percentage | 5---memory(VSZ) 6---memory(RSS)
        var str = 'ps aux | awk \'{print $3"  "$5"  "$4"  "$11}\''
          + ' | sort | uniq -c | awk \'{print "{\\"name\\":\\"" $5 "\\", \\"cpu\\":" $2 ", \\"memRSS\\":" $3*0.001 ", \\"%mem\\":" $4"}"}\' '
          + ' | sort -nr |grep ' + processName;
        return str;
      },
      responseParser: function (str) {
        str = str.trim();
        if (str && str !== "") {
          str = '[' + str.split('\n').join(",") + ']';
          str = JSON.parse(str);
          return str;
        }
      }
    }
  };

  module.exports = ProcessHelper;
})();