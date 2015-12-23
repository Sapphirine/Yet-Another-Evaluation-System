var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
router.post('/', function(req, res){
	var _userName = req.body.userName;
	var _password = req.body.password;
	var user = new User({userName:_userName, password:_password});
	user.Login(function(status, msg){


		res.json({'status':status, 'msg':msg});
	

	});
});

router.get('/', function(req, res){
	res.send("remain to complete.");
});

module.exports = router;

