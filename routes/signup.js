var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var router = express.Router();



//user model
var userModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// sign up page
router.get('/',checkNotLogin, function(req, res, next) {
  // console.log("hello world");
  res.render('signup');
});

// sign up
router.post('/', checkNotLogin, function(req, res, next) {
  var name = req.fields.name;
  // console.log('what: ' + name);
  var gender = req.fields.gender;
  var bio = req.fields.bio;
  var avatar = req.files.avatar.path.split(path.sep).pop();
  // console.log('what: ' + avatar);
  // console.log('what: ' + avatar.name);
  var password = req.fields.password;
  var repassword = req.fields.repassword;

  //check parameters
  try {
    //check name
    if (name.length == 0) {
      throw new Error('名字不能为空!');
    }
    if (!(name.length >= 1 && name.length <= 15)) {
      throw new Error('名字长度不超过15个字符');
    }
    //password
    if (password.length == 0) {
      throw new Error('密码不能为空');
    }
    if (password.lenght < 6) {
      throw new Error('密码长度至少为6个字符');
    }
    if (password !== repassword) {
      throw new Error('两次密码输入不一样');
    }
    //bio
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('个人简介不能超过30个字符');
    }
    //avatar
    // if (req.files.avatar === undefined) {
    //   throw new Error('缺少头像');
    // }
    //gender
    if (['m', 'f', 'x'].indexOf(gender) === -1) {
      throw new Error('性别只能是 m、f 或 x');
    }
  } catch(e) {
    req.flash('error', e.message);
    return res.redirect('/signup');
  }

  //sha1
  password = sha1(password);
  console.log(password);

  // create user
  var user = {
    name: name,
    password: password,
    avatar: avatar,
    gender: gender,
    bio: bio
  };


  //save date
  userModel.create(user)
    .then(function (result) {
      // console.log("result" + result);
      // 此 user 是插入 mongodb 后的值，包含 _id
      user = result;
      // 将用户信息存入 session
      delete user['password'];
      // console.log("now" + user);
      req.session.user = user;
      // 写入 flash
      req.flash('success', '注册成功');
      // 跳转到首页
      res.redirect('/posts');
    })
    .catch(function (e) {
      // 用户名被占用则跳回注册页，而不是错误页
      if (e.message.match('E11000 duplicate key')) {
        req.flash('error', '用户名已被占用');
        return res.redirect('/signup');
      }
      // console.log("error???");
      next(e);
    });

});

module.exports = router;
