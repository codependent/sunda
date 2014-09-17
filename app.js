var express = require('express');
var path = require('path');
var middlewares = require('./middlewares');
var errorHandling = require('./middlewares/error-handling');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

middlewares(app);
errorHandling(app);

module.exports = app;
