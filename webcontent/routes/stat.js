var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/stat', function(req, res) {
  res.render('label', {});
});

module.exports = router;
