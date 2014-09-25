var winston = require('winston');
var nconf = require('nconf');

winston.loggers.add('application', {
	console: {
        silent: (process.env.NODE_ENV == 'production')
    },
    /*file: { filename: __dirname+'/output/out.log', json: false }*/
    transports: [ new (winston.transports.DailyRotateFile)({ filename: nconf.get('log').application.file, datePattern: '.yyyy-MM-dd', json : false}) ]
});

var appLog = winston.loggers.get('application');
module.exports = appLog;
