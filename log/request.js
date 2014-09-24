var winston = require('winston');
winston.loggers.add('main_nojson', {
	console: {
        silent: false
    },
    file: {
        filename: './log/output/http.log',
        json: false
    }
});

winston.loggers.add('main_json', {
	console: {
        silent: true
    },
    file: {
        filename: './log/output/http_json.log',
        json: false
    }
});

var winlog1 = winston.loggers.get('main_nojson');
var winlog2 = winston.loggers.get('main_json');

var winstonStream = {
    write: function(message, encoding){
    	message = message.replace(/\r?\n|\r/g,"");
        winlog1.info(message);
        winlog2.info(message);
    }
};

module.exports = winstonStream;