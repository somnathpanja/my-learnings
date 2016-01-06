(function () {
    var fs = require('fs');
    var FileWritter = function (path, fileName) {
        this._fileName = path + "/" + fileName;
    };

    FileWritter.prototype.write = function (data, cb) {
        var data2Write = data;
        if (typeof data == "object") {

            try {
                data2Write = JSON.stringify(data);
            } catch (e) {
                data2Write = e.toString();
            }

        }

        data2Write += '\n';

        if (cb) {
            fs.appendFile(this._fileName, data2Write, function (err) {
                if (err) throw err;
                cb.apply(null, [err]);
            });
        } else {
            fs.appendFile(this._fileName, data2Write, function (err) {
                console.log(err);
            });
        }
    };

    module.exports = FileWritter;

})();