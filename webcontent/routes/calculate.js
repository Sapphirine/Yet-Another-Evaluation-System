var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Pic = mongoose.model('Pic');
/* GET home page. */
router.get('/', function(req, res) {

	User.Calculate(function(status, msg){
		res.json({'status':status, 'msg':msg});
	});
});

router.post('/user', function(req, res){
    var userId = req.body.userId;
    User.GetUserInfo(userId,function(status, msg){
        res.json({'status':status, 'msg':msg});
    })

});
router.post('/totalImage', function(req, res){
   Pic.Statistics(function(status, msg){
     res.json({'status':status, 'msg':msg});
   });
});

module.exports = router;