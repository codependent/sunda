var express = require('express');
var router = express.Router();

module.exports = function(rootRouter){
	router.route('/')
	
		.get(function(req, res, next) {
			//TODO hasta que los obtengamos de BBDD
			res.json([]);
			
		}).post(function(req, res, next){
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
			//TODO hasta que generemos un id por BBDD
			req.body.id = Math.random();
			return res.json(req.body);
			
		}).put(function(req, res, next){
			console.log(req.body);
			console.log(rootRouter);
			
		});
	
	router.route('/:id')
	
		.delete(function(req, res, next){
			//TODO Obtener el path del id
			var path = "/mobmgr/action/devices";
			var removed = false;
			for(var i=0; !removed && i< rootRouter.stack.length; i++){
				if(rootRouter.stack[i].regexp.test(path)){
					rootRouter.stack.splice(i, 1);
					console.log(rootRouter.stack);
					removed=true;
				}
			}
		});
	
	return router;
}