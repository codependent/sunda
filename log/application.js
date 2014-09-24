var winston = require('winston');

winston.loggers.add('application', {
	console: {
        silent: (process.env.NODE_ENV == 'production')
    },
    file: {
        filename: __dirname+'/output/out.log',
        json: false
    }
});

var appLog = winston.loggers.get('application');
module.exports = appLog;
