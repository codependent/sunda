var winston = require('winston');

winston.loggers.add('application', {
	console: {
        silent: (process.env.NODE_ENV == 'production')
    },
    /*file: { filename: __dirname+'/output/out.log', json: false }*/
    transports: [ new (winston.transports.DailyRotateFile)({ filename: __dirname+'/output/out.log', datePattern: '.yyyy-MM-dd', json : false}) ]
});

var appLog = winston.loggers.get('application');
module.exports = appLog;
