var Q = require('q');
var Datastore = require('nedb');
var Routes = new Datastore({ filename: './db/bin/routes', autoload: true });

Routes.find 	= Q.nbind(Routes.find, Routes);
Routes.findOne 	= Q.nbind(Routes.findOne, Routes);
Routes.insert 	= Q.nbind(Routes.insert, Routes);
Routes.update 	= Q.nbind(Routes.update, Routes);
Routes.remove 	= Q.nbind(Routes.remove, Routes);

module.exports = Routes;

