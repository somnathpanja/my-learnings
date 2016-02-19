var date = new Date(); // 4:55

var getLastHourDT = function (date) {
  var dt = new Date(date.getTime());
  dt.setUTCHours(date.getUTCHours(), 0, 0, 0);
  return dt;
};

var getHourIndex = function (dt) {
  return date.getUTCHours();
};

var getMinuteIndex = function (dt) {
  return date.getUTCMinutes();
};

console.log("    Current Date Is =", date.toUTCString());
console.log("      TargetHour TS =", getLastHourDT(date).toUTCString()); // 5:00
console.log("  Target Hour Index =", getHourIndex(date));
console.log("Target Minute Index =", getMinuteIndex(date));

console.log("So while updating hours collection update 'A.samples." + getMinuteIndex(date) +
  "' where selector are Mac=XXX,Hour=", getHourIndex(date));

module.exports.getLastHourDT = getLastHourDT;
module.exports.getHourIndex = getHourIndex;
module.exports.getMinuteIndex = getMinuteIndex;