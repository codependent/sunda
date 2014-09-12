var Datastore = require('nedb');
var db = {};
db.routes = new Datastore({ filename: './db/bin/routes', autoload: true });

var express = require('express');
var path = require('path');
var middlewares = require('./middlewares');
var errorHandling = require('./middlewares/error-handling');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

middlewares(app, db);
errorHandling(app);

module.exports = app;
