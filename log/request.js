var winston = require('winston');
winston.loggers.add('request', {
	console: {
        silent: true
    },
    file: {
        filename: __dirname+'/output/http.log',
        json: false
    }
});

winston.loggers.add('request_json', {
	console: {
        silent: true
    },
    file: {
        filename: __dirname+'/output/http_json.log',
        json: false
    }
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

module.exports.stream = winstonStream;
module.exports.format = ':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms';