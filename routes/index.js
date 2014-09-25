var express = require('express');
var router = express.Router();
var logger = require('../log').appLog;

/* GET home page. */
router.get('/', function(req, res, next) {
	logger.info("Entering home page");
  	res.render('index', { title: 'Sunda' });
});

module.exports = router;
