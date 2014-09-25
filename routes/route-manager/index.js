var express = require('express');
var Routes = require('../../models/routes');
var router = express.Router();
var logger = require('../../log').appLog

var initialized = false;

module.exports = function(rootRouter){

	router.use(function(req, res, next) {
		if(req.body.path && req.body.path.indexOf("/")!=0){
			req.body.path = "/"+req.body.path;
		}
		next();	
	});

	router.route('/init')
	.get(function(req, res, next){
		logger.info("Inicializando rutas - Ya inicializado? "+initialized);
		if(!initialized){
			Routes.find({})
			.then(function(docs) {
				if(docs){
					for(var i in docs){
						req.body = docs[i];
						createExpressRoute(req, res, next);
					}
				}
				initialized = true;
			})
			.fail(function(err){
				next(err);
			});
		}
		res.status(200).send();
	});

	router.route('/')
	.get(function(req, res, next) {
		Routes.find({})
		.then(function (docs) {
			res.json(docs);		
		})
		.fail(function(err){
			next(err);
		});
		
	}).post(function(req, res, next){
		createExpressRoute(req, res, next);
		Routes.insert(req.body)
		.then(function(newDoc) {
			res.status(201);
			return res.json(newDoc);
		})
		.fail(function(err){
			next(err);
		});
					
	}).put(function(req, res, next){
		Routes.findOne({_id : req.body._id})
		.then(function (doc){
			removeExpressRoute(doc.path);
			createExpressRoute(req, res, next);
			return Routes.update({_id: req.body._id}, req.body)
		})
		.then(function (numReplaced) {
			res.send();
		})
		.fail(function(err){
			next(err);
		});
	});
	

	router.route('/:id')
		.delete(function(req, res, next){
			Routes.findOne({_id : req.param('id')})
			.then(function(doc){
				removeExpressRoute(doc.path);
				return Routes.remove({ _id: req.param('id') }, {})
			}).then(function(numRemoved) {
  				res.send(200);
			})
			.fail(function(err){
				next(err);
			});
		});
	  				

	function createExpressRoute(req, res, next){
		if(req.body.method == 'GET'){
			rootRouter.route(req.body.path)
				.get(function(req, res) {
					processCall(req, res, next);
				});
		}else if(req.body.method == 'POST'){
			rootRouter.route(req.body.path)
				.post(function(req, res) {
					processCall(req, res, next);
				});
		}else if(req.body.method == 'PUT'){
			rootRouter.route(req.body.path)
				.put(function(req, res) {
					processCall(req, res, next);
				});
		}else if(req.body.method == 'DELETE'){
			rootRouter.route(req.body.path)
				.delete(function(req, res) {
					processCall(req, res, next);
				});
		}
	}

	function removeExpressRoute(path){
		var removed = false;
		for(var i=0; !removed && i< rootRouter.stack.length; i++){
			if(rootRouter.stack[i].regexp.test(path)){
				rootRouter.stack.splice(i, 1);
				removed=true;
			}
		}
	}

	function processCall(req, res, next){
		var originalUrl = req.originalUrl;
		if(originalUrl.indexOf("?")!=-1){
			originalUrl = originalUrl.substring(0,originalUrl.indexOf("?"));
		}
		var matchedUrl = null;
		for(var i=0; i<rootRouter.stack.length && matchedUrl == null; i++){
			if(rootRouter.stack[i].regexp.test(originalUrl)){
				matchedUrl = rootRouter.stack[i].route.path;
			}
		}
		Routes.findOne({path : matchedUrl, method : req.method})
		.then(function(doc){
			if(!doc){
				res.send(404);
			}else{
				var paramsOk = true;
				if(doc.params.length>0){
					for (var i = 0; paramsOk && i < doc.params.length; i++) {
						if(req.query[doc.params[i].key] == undefined){
							paramsOk = false;
						}else{
							if(doc.params[i].value!='' && req.query[doc.params[i].key] != doc.params[i].value){
								paramsOk = false;
							}
						}
					};
				}
				if(paramsOk){
					if(doc.response.type){
						res.header("Content-Type", doc.response.type);
					}
					if(doc.response.data){
						res.status(doc.response.code).send(doc.response.data);			
					}else{
						res.status(doc.response.code).send();
					}	
				}else{
					res.status(404).send();
				}			
			}
		})
		.fail(function(err){
			next(err);
		});
	}

	return router;
}