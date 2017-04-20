var express = require('express');
var router = express.Router();

//Promise
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//check status
var checkNotLogin = require('../middlewares/check').checkNotLogin;
//secret the password
var sha1 = require('sha1');
//user model
var UserModel = require('../models/users');
//midllewares
var create_at = require('../middlewares/create_at').afterFindOne;



// log in page render
router.get('/', checkNotLogin, function(req, res, next) {
  res.render('login');
});

// log in
router.post('/', checkNotLogin, function(req, res, next) {
  //get form fields
  var name = req.fields.name;
  var password = req.fields.password;

  //check name&password
  UserModel.getUserByName(name)
    .then(function(result) {
      return create_at.afterFind(result);
    })
    .then(function(user) {
      if (!user) {
        req.flash('error', '用户不存在哦亲!');
        return res.res.redirect('back');
      }

      //check
      if (sha1(password) !== user.password) {
        req.flash('error', '密码错误哦亲!');
      }

      req.flash('success', '登录成功!');

      // console.log('password now' + user.password);
      //delete password
      delete user['password'];
      // console.log('now' + user.password);

      //seesion
      req.session.user = user;

      res.redirect('/posts');
    })
    .catch(next);
});


module.exports = router;
