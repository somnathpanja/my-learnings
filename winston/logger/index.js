(function () {
    if (GLOBAL.ABCDLogger) {
        module.exports = GLOBAL.ABCDLogger;
        return;
    }

    var fs = require('fs'),
        path = require('path'),
        winston = new require('winston'),
        longjohn = require('longjohn'),
        appName = process.title,
        config = require("../lib/config/config"),
        LOG_LOCATION = config.logger.filepath;//path.join(__dirname, "logs", path.sep);

    var INFO_LOGGER, MONITOR_LOGGER, DEBUG_LOGGER,
        LOG_FILE = {
            STDOUT_LOG: LOG_LOCATION + appName + "_stdout.log",
            STDERR_LOG: LOG_LOCATION + appName + "_stderr.log",
            INFO_LOG: LOG_LOCATION + appName + "_info.log",
            DEBUG_LOG: LOG_LOCATION + appName + "_debug.log",
            MONITOR_LOG: LOG_LOCATION + appName + "_monitor.log"
        },
        WINSTON_CONF = {
            levels: {
                data: 0,
                info: 1,
                debug: 2,
                warn: 3,
                error: 4,
                critical: 5
            }
        };

    longjohn.async_trace_limit = 5;

    (function init() {
        if (!fs.existsSync(LOG_LOCATION))
            fs.mkdirSync(LOG_LOCATION);

        if (process.env.NODE_ENV == 'development') {
            process.__defineGetter__('stdout', function () {
                return fs.createWriteStream(LOG_FILE.STDOUT_LOG, {flag: 'a+'});
            });
            process.__defineGetter__('stderr', function () {
                return fs.createWriteStream(LOG_FILE.STDERR_LOG, {flag: 'a+'});
            });
        }

        INFO_LOGGER = new (winston.Logger)({
            name: appName,
            levels : {'info': 0, 'data' : 1},
            transports: [
                new winston.transports.File({
                    name: 'info',
                    filename: LOG_FILE.INFO_LOG,
                    json: false,
                    datePattern: '-yyyy-MM-dd',
                    timestamp: function () {
                        return (new Date()).toUTCString();
                    },
                    formatter: function (options) {
                        var data = options.meta;
                        data.app_name = appName;
                        data.timestamp = options.timestamp();
                        data.level = options.level.toUpperCase();
                        data.message = options.message ? options.message : '';
                        return JSON.stringify(options.meta);
                    }
                })
            ]
        });

        DEBUG_LOGGER = new (winston.Logger)({
            name: appName,
            levels: WINSTON_CONF.levels,
            transports: [
                new (winston.transports.File)({
                    filename: LOG_FILE.DEBUG_LOG,
                    json: false,
                    datePattern: '-yyyy-MM-dd',
                    timestamp: function () {
                        return (new Date()).toUTCString();
                    },
                    formatter: function (options) {
                        var data = {
                            app_name: appName,
                            log_level: options.level.toUpperCase(),
                            timestamp: options.timestamp(),
                            message: (options.message ? options.message : ''),
                            extra_info: options.meta
                        };

                        return JSON.stringify(data);
                    }
                })
            ]
        });

        MONITOR_LOGGER = new (winston.Logger)({
            name: appName,
            levels: WINSTON_CONF.levels,
            transports: [
                new (winston.transports.File)({
                    filename: LOG_FILE.MONITOR_LOG,
                    json: false,
                    datePattern: '-yyyy-MM-dd',
                    timestamp: function () {
                        return (new Date()).toUTCString();
                    },
                    formatter: function (options) {
                        var data = {
                            app_name: appName,
                            log_level: options.level.toUpperCase(),
                            timestamp: options.timestamp(),
                            message: (options.message ? options.message : ''),
                            extra_info: options.meta
                        };

                        return JSON.stringify(data);
                    }
                })
            ]
        });
    })();

    module.exports = GLOBAL.ABCDLogger = {
        data: function () {
            if (INFO_LOGGER) INFO_LOGGER.data(INFO_LOGGER, arguments);
        },
        info: function () {
            if (INFO_LOGGER) INFO_LOGGER.info(INFO_LOGGER, arguments);
        },
        warn: function () {
            if (DEBUG_LOGGER) DEBUG_LOGGER.warn.apply(DEBUG_LOGGER, arguments);
        },
        debug: function () {
            if (DEBUG_LOGGER) DEBUG_LOGGER.debug.apply(DEBUG_LOGGER, arguments);
        },
        error: function () {
            if (DEBUG_LOGGER) DEBUG_LOGGER.error.apply(DEBUG_LOGGER, arguments);
            if (MONITOR_LOGGER) MONITOR_LOGGER.error.apply(MONITOR_LOGGER, arguments);
        },
        critical: function () {
            if (DEBUG_LOGGER) DEBUG_LOGGER.critical.apply(DEBUG_LOGGER, arguments);
            if (MONITOR_LOGGER) MONITOR_LOGGER.critical.apply(MONITOR_LOGGER, arguments);
        }
    };
})();