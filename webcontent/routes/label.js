var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Pic = mongoose.model('Pic');
var Label = mongoose.model('Label');
router.post('/', function(req, res) {
    var _labeler = req.body.user;
    var _picId = req.body.picId;
    var _labelType = "HUMAN";
    var _leftShoulderX = req.body.leftShoulderX;
    var _leftShoulderY = req.body.leftShoulderY;
    var _leftMiddleShoulderX = req.body.leftMiddleShoulderX;
    var _leftMiddleShoulderY = req.body.leftMiddleShoulderY;
    var _leftNeckX = req.body.leftNeckX;
    var _leftNeckY = req.body.leftNeckY;
    var _rightShoulderX = req.body.rightShoulderX;
    var _rightShoulderY = req.body.rightShoulderY;
    var _rightMiddleShoulderX = req.body.rightMiddleShoulderX;
    var _rightMiddleShoulderY = req.body.rightMiddleShoulderY;
    var _rightNeckX = req.body.rightNeckX;
    var _rightNeckY = req.body.rightNeckY;
    var _posData = req.body.position;
    var _shoulderType = req.body.shoulderType;
    var label = new Label();
    label.labeler = _labeler;
    label.picId = _picId;
    label.leftShoulderX = _leftShoulderX;
    label.leftShoulderY = _leftShoulderY;
    label.leftMiddleShoulderX = _leftMiddleShoulderX;
    label.leftMiddleShoulderY = _leftMiddleShoulderY;
    label.leftNeckX = _leftNeckX;
    label.leftNeckY = _leftNeckY;
    label.rightShoulderX = _rightShoulderX;
    label.rightShoulderY = _rightShoulderY;
    label.rightMiddleShoulderX = _rightMiddleShoulderX;
    label.rightMiddleShoulderY = _rightMiddleShoulderY;
    label.rightNeckX = _rightNeckX;
    label.rightNeckY = _rightNeckY;
    label.labelType = "HUMAN";
    label.position = _posData;
    label.shoulderType = _shoulderType;
    label.valid = true;
    console.log(label);
    label.LabelPicture(function (status, msg) {
        res.json({'status': status, 'msg': msg});
    });
});



router.get('/', function(req, res){
	res.send("remain to complete.");
});

module.exports = router;