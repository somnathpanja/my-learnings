module.exports.stats = function () {
  var stats = {};

  stats.A = getSamples();
  stats.B = getSamples();
  stats.C = getSamples();
  stats.D = getSamples();
  stats.E = getSamples();

  return stats;
};

function getSamples() {
  var obj = {};
  for (var i = 0; i <= 59; i++) {
    if (i == 0)
      obj[i] = 5;
    else
      obj[i] = NaN;
  }

  return {
    sum: 5,
    count: 1,
    max: 5,
    min: 5,
    sampleSize: 60,
    samples: obj
  };
}