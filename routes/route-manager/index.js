var express = require('express');
var router = express.Router();

module.exports = function(rootRouter, db){

	router.use(function(req, res, next) {
		if(req.body.path){
			if(req.body.path.indexOf("/")!=0){
				req.body.path = "/"+req.body.path;
			}
		}
		next();	
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
			db.routes.update({_id: req.body._id}, req.body , function (err, numReplaced) {
				if(err) throw new Exception(err);
				console.log("num updated "+ numReplaced);
				return res.send(200);
			});
		});
	

	router.route('/:id')
		.delete(function(req, res, next){
			db.routes.findOne({_id : req.param('id')}, function(err, doc){
				if(err) throw new Exception(err);	
					console.log("FOUNDDDDD")
					console.log(doc);			
					removeExpressRoute(doc.path);
					db.routes.remove({ _id: req.param('id') }, {}, function (err, numRemoved) {
					if(err) throw new Exception(err);
					console.log("number of removed: "+numRemoved);
	  				res.send(200);	
				});
			});			
		});


	function createExpressRoute(req, res){
		console.log(rootRouter.stack);
		if(req.body.method == 'GET'){
			rootRouter.route(req.body.path)
				.get(function(req, res) {
					res.send('GET called!!!');
				});
		}else if(req.body.method == 'POST'){
			rootRouter.route(req.body.path)
			.post(function(req, res) {
				res.send('POST called!!!');
			});
		}else if(req.body.method == 'PUT'){
			rootRouter.route(req.body.path)
			.put(function(req, res) {
				res.send('PUT called!!!');
			});
		}else if(req.body.method == 'DELETE'){
			rootRouter.route(req.body.path)
			.delete(function(req, res) {
				res.send('DELETE called!!!');
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

	return router;
}