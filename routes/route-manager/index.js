var express = require('express');
var router = express.Router();
var initialized = false;

module.exports = function(rootRouter, db){

	router.use(function(req, res, next) {
		if(req.body.path && req.body.path.indexOf("/")!=0){
			req.body.path = "/"+req.body.path;
		}
		next();	
	});

	router.route('/init')
	.get(function(req, res, next){
		if(!initialized){
			db.Routes.find({})
			.then(function(docs) {
				if(docs){
					for(var i in docs){
						req.body = docs[i];
						createExpressRoute(req, res);
					}
				}
				initialized = true;
			})
			.fail(function(err){
				throw new Exception(err);
			});
		}
		res.status(200);
		res.send();
	});

	router.route('/')
	.get(function(req, res, next) {
		db.Routes.find({})
		.then(function (docs) {
			res.json(docs);		
		})
		.fail(function(err){
			throw new Exception(err);
		});
		
	}).post(function(req, res, next){
		createExpressRoute(req, res);
		db.Routes.insert(req.body)
		.then(function(newDoc) {
			return res.json(newDoc);
		})
		.fail(function(err){
			throw new Exception(err);
		});
					
	}).put(function(req, res, next){
		db.Routes.findOne({_id : req.body._id})
		.then(function (doc){
			removeExpressRoute(doc.path);
			createExpressRoute(req, res);
			return db.Routes.update({_id: req.body._id}, req.body)
		})
		.then(function (numReplaced) {
			console.log("num updated "+ numReplaced);
			return res.send(200);
		})
		.fail(function(err){
			throw new Exception(err);
		});
	});
	

	router.route('/:id')
		.delete(function(req, res, next){
			db.Routes.findOne({_id : req.param('id')})
			.then(function(doc){
				removeExpressRoute(doc.path);
				return db.Routes.remove({ _id: req.param('id') }, {})
			}).then(function(numRemoved) {
				console.log("number of removed: "+numRemoved);
  				res.send(200);
			})
			.fail(function(err){
				throw new Exception(err);
			});
		});
	  				

	function createExpressRoute(req, res){
		if(req.body.method == 'GET'){
			rootRouter.route(req.body.path)
				.get(function(req, res) {
					processCall(req, res);
				});
		}else if(req.body.method == 'POST'){
			rootRouter.route(req.body.path)
				.post(function(req, res) {
					processCall(req, res);
				});
		}else if(req.body.method == 'PUT'){
			rootRouter.route(req.body.path)
				.put(function(req, res) {
					processCall(req, res);
				});
		}else if(req.body.method == 'DELETE'){
			rootRouter.route(req.body.path)
				.delete(function(req, res) {
					processCall(req, res);
				});
		}
	}

	function removeExpressRoute(path){
		var removed = false;
		for(var i=0; !removed && i< rootRouter.stack.length; i++){
			if(rootRouter.stack[i].regexp.test(path)){
				rootRouter.stack.splice(i, 1);
				console.log(rootRouter.stack);
				removed=true;
			}
		}
	}

	function processCall(req, res){
		var originalUrl = req.originalUrl;
		console.log("*****************************");
		console.dir(originalUrl);
		console.log("*****************************");
		console.log(rootRouter.stack);
		console.log("*****************************")

		if(originalUrl.indexOf("?")!=-1){
			originalUrl = originalUrl.substring(0,originalUrl.indexOf("?"));
		}
		var matchedUrl = null;
		for(var i=0; i<rootRouter.stack.length && matchedUrl == null; i++){
			if(rootRouter.stack[i].regexp.test(originalUrl)){
				matchedUrl = rootRouter.stack[i].route.path;
			}
		}
		console.log(matchedUrl);
		
		db.Routes.findOne({path : matchedUrl})
		.then(function(doc){
			if(!doc){
				res.send(404);
			}else{
				var paramsOk = true;
				if(doc.params.length>0){
					for (var i = 0; paramsOk && i < doc.params.length; i++) {
						console.log("doc param "+doc.params[i].key);
						console.log("req query "+req.query[doc.params[i].key]);
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
						res.send(doc.response.code, doc.response.data);			
					}else{
						console.log("sending response status "+doc.response.code);
						res.status(doc.response.code);			
						res.send(doc.response.code);
					}	
				}else{
					res.status(401);
					res.send(401);
				}			
			}
		})
		.fail(function(err){
			throw new Exception(err)
		})
	}

	return router;
}