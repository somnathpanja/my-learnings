module.exports.stats = function () {
  var stats = {};
  function getSamples() {
    var obj = {};
    for (var i = 0; i < 59; i++) {
      obj[i.toString()] = i;
    }

    return obj;
  }
  stats.A = getSamples();
  stats.B = getSamples();
  stats.C = getSamples();
  stats.D = getSamples();
  stats.E = getSamples();

  return stats;
};

