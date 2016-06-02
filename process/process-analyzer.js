var AllProcessNames = [
  "CnsWebServer",
  "CnsRegistrationServer",
  "CnsConfigServer",
  "CnsSecurityServer",
  "CnsMonitorServer",
  "CnsNotificationServer",
  "CnsSubscriptionServer",
  "CnsNotificationServer",
  "CnsNotificationServer",
  "CnsMetricsScheduler",
  "CnsActionsWorker",
  "CnsUpgradeServer",
  "CnsDeviceServer"
];

var SelectedProcessNames = ["CnsRegistrationServer", "CnsDeviceServer", "CnsMonitorServer", "mongod"];
var PH = require('./../common/processHelper');
var fs = require('fs');
var FileWriter = require('../common/file-writer');
var logs = {};

for (var index in SelectedProcessNames) {
  //logs[index] = new FileWriter('./logs', SelectedProcessNames[index] + '_stats.log');
}

var commonLog = new FileWriter('./logs', 'common_stats.log');

try {
  fs.unlink('./logs/common_stats.log', function(){});
} catch (e) {
}

var firsTime = true;
var csvFirstRow = '"ts",';

var collectAndLogCPUAndMemoryOfSelectedProcess = function (done) {
  var index = 0;
  var currentTime = Date.now();
  var csvRow = currentTime;
  var collectStats4Process = function () {
    if (index >= SelectedProcessNames.length) {
      if (firsTime) {
        commonLog.write(csvFirstRow);
        firsTime = false;
      }
      commonLog.write(csvRow);
      done();
      return;
    }

    var processName = SelectedProcessNames[index];


    PH.exec(PH.COMMANDS.CPU_MEMORY_BY_PROCESS_NAME, [processName], function (err, processInfo) {
      index++;
      if (!processInfo) {
        console.log("Process are not running..");
        return;
      }

      if (Array.isArray(processInfo)) {
        if (firsTime) {
          processInfo.forEach(function (item, index) {
            csvFirstRow = csvFirstRow
              + '"' + item.name + '-CPU",'
              + '"' + item.name + '-MemRSS(MB)",'
              + '"' + item.name + '-%MEM",';
          });
        }

        processInfo.forEach(function (item) {
          csvRow += ',' + item.cpu;
          csvRow += ',' + item.memRSS;
          csvRow += ',' + item['%mem'];

          item.ts = currentTime;
        });
      }

      collectStats4Process();
    });
  };

  collectStats4Process();
};

var timer = function () {
  collectAndLogCPUAndMemoryOfSelectedProcess(function () {
    setTimeout(timer, 2000);
  });
};

setTimeout(timer, 2000);
