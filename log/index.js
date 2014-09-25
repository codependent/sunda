var winston = require('winston');
var nconf = require('nconf');

winston.loggers.add('application', {
	console: {silent: (process.env.NODE_ENV == 'production')},
    /*file: { filename: __dirname+'/output/out.log', json: false }*/
    transports: [ new (winston.transports.DailyRotateFile)({ filename: nconf.get('log').application.file, datePattern: '.yyyy-MM-dd', json : false}) ]
});

winston.loggers.add('request', {
	console: {silent: true},
    /*file: { filename: __dirname+'/output/http.log', json: false }*/
    transports: [ new (winston.transports.DailyRotateFile)({ filename: nconf.get('log').http.file, datePattern: '.yyyy-MM-dd', json : false }) ]
});

winston.loggers.add('request_json', {
	console: {silent: true},
    /*file: {filename: __dirname+'/output/http_json.log', json: false }*/
    transports: [ new (winston.transports.DailyRotateFile)({ filename: nconf.get('log').http.jsonFile, datePattern: '.yyyy-MM-dd', json : true }) ]
});

var winlog1 = winston.loggers.get('request');
var winlog2 = winston.loggers.get('request_json');

var winstonStream = {
    write: function(message, encoding){
    	message = message.replace(/\r?\n|\r/g,"");
        winlog1.info(message);
        winlog2.info(message);
    }
};

module.exports.request = {format : nconf.get('log').http.format, stream : winstonStream}
module.exports.appLog = winston.loggers.get('application');
