var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

// logout
router.get('/', checkLogin, function(req, res, next) {
  //clear session
  req.session.user = null;
  req.flash('success', '已退出!');
  res.redirect('/posts');
});

module.exports = router;
