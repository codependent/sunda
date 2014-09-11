var express = require('express');
var router = express.Router();

module.exports = function(rootRouter){
	router.route('/')
		.get(function(req, res, next) {
			res.json([{ id: 1, method: "GET",  path: "/action/cosa",  params : null,  groupId : null },
			          { id: 2, method: "POST", path: "taskmgr/action/tareas",  params : null,  groupId : "taskmgr" }]);
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
			//XXX hasta que generemos un id por BBDD
			req.body.id = Math.random();
			return res.json(req.body)
		}).put(function(req, res, next){
				console.log(rootRouter);
			}
		);
	return router;
}