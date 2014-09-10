var express = require('express');
var router = express.Router();

module.exports = function(rootRouter){
	router.route('/')
		.get(function(req, res, next) {
			res.send('Call list');	
		}).post(function(req, res, next){
			console.log(req.body.method +"-"+req.body.path);
			if(req.body.method == 'GET'){
				console.log("creating GET user route");
				rootRouter.route(req.body.path)
					.get(function(req, res) {
						console.log("INVOKING!!!!!!!!!")
						res.send('called!!!');
					});
			}else if(req.body.method == 'POST'){
				
			}else if(req.body.method == 'PUT'){
				
			}else if(req.body.method == 'DELETE'){
				
			}
			res.send('created');
		});
	return router;
}


