var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var winstonRequestStream = require('../log/request')

var routes = require('../routes/index');
var routeManager = require('../routes/route-manager');

module.exports = function(app, db){
	app.use(favicon());
	app.use(logger('common', {stream: winstonRequestStream}))
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended:true}));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname+"/../", 'public')));

	app.use('/', routes);
	app.use('/user-routes', routeManager(routes, db));
}
