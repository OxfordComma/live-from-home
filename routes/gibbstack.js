var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
	res.render('gibbstack')
})

router.get('/charities', function(req, res, next) {
	res.render('charities')
})
module.exports = router;
