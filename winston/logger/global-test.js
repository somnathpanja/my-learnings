process.title = "testApp";
require('./index.js'); // One time require in whole app
Logger = CNSNGLogger;

Logger.info('This is a sample info message %s'.red);
Logger.debug('This is a sample debug message', {a:1});
//Logger.error('This is a sample error message', {a:1});
Logger.warn('This is a sample warning message', {a:1});
Logger.critical('This is a sample critical message', {a:1});
