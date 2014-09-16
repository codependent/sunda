var express = require('express');
var router = express.Router();
var initialized = false;

module.exports = function(rootRouter, db){

	router.use(function(req, res, next) {
		if(req.body.path){
			if(req.body.path.indexOf("/")!=0){
				req.body.path = "/"+req.body.path;
			}
		}
		next();	
	});

	router.route('/init')
		.get(function(req, res, nest){
			if(!initialized){
				console.log("/init!");
				db.routes.find({}, function (err, docs) {
					if(err) throw new Exception(err);
					if(docs){
						for(var i in docs){
							req.body = docs[i];
							createExpressRoute(req, res);
						}
					}
				});
				initialized = true;
			}
			res.status(200);
			res.send();
		});

	router.route('/')
		.get(function(req, res, next) {
			db.routes.find({}, function (err, docs) {
				if(err) throw new Exception(err);
				res.json(docs);		
			});
			
		}).post(function(req, res, next){
			createExpressRoute(req, res);
			db.routes.insert(req.body, function (err, newDoc) {
				if(err) throw new Exception(err);
  				return res.json(newDoc);
			});
						
		}).put(function(req, res, next){
			db.routes.findOne({_id : req.body._id}, function(err, doc){
				console.log(doc);
				if(err) throw new Exception(err);		
				removeExpressRoute(doc.path);
				createExpressRoute(req, res);
				db.routes.update({_id: req.body._id}, req.body , function (err, numReplaced) {
					if(err) throw new Exception(err);
					console.log("num updated "+ numReplaced);
					return res.send(200);
				});
			});		
		});
	

	router.route('/:id')
		.delete(function(req, res, next){
			db.routes.findOne({_id : req.param('id')}, function(err, doc){
				if(err) throw new Exception(err);		
				removeExpressRoute(doc.path);
				db.routes.remove({ _id: req.param('id') }, {}, function (err, numRemoved) {
					if(err) throw new Exception(err);
					console.log("number of removed: "+numRemoved);
	  				res.send(200);	
				});
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
		console.log("*****************************");
		console.dir(req.originalUrl);
		console.log("*****************************");
		console.log(rootRouter.stack);
		console.log("*****************************")

		var matchedUrl = null;
		for(var i=0; i<rootRouter.stack.length && matchedUrl == null; i++){
			console.log(rootRouter.stack[i].regexp);
			if(rootRouter.stack[i].regexp.test(req.originalUrl)){
				matchedUrl = rootRouter.stack[i].route.path;
			}
		}

		db.routes.findOne({path : matchedUrl}, function(err, doc){
			if(err) throw new Exception(err);		
			if(!doc){
				res.send(404);
			}else{
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
			}
		});	
	}

	return router;
}