var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//post model
var PostModel = require('../models/posts');
var checkLogin = require('../middlewares/check').checkLogin;
//middlewares
var create_at = require('../middlewares/create_at');
var markdownToHTML = require('../middlewares/markdownToHTML');

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', function(req, res, next) {

  var author = req.query.author;

  PostModel.getPosts(author)
    .then(function(result) {
      return create_at.afterFind(result);
    })
    .then(function(result) {
      return markdownToHTML.M2H_AfterFind(result);
    })
    .then(function(posts) {
      // console.log('all: ' + posts);
      res.render('posts', {
        posts: posts
      });
    })
    .catch(next);
});

// create a post
router.post('/', checkLogin, function(req, res, next) {
  var author = req.session.user._id;
  var title = req.fields.title;
  var content = req.fields.content;

  //check
  try {
    //check title
    if (title && title.length == 0) {
      throw new Error('标题不能为空!');
    }
    //check content
    if (content && content.length == 0) {
      throw new Error('内容不能为空!');
    }

  } catch(e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }

  //contrcut post entity
  var post = {
    author: author,
    title: title,
    content: content,
    pv: 0
  };

  //create post
  PostModel.create(post)
    .then(function(result) {
      post = result;
      req.flash('success', '成功发表一篇文章!厉害了亲!');
      res.redirect('/posts/${post._id}');
    })
    .catch(next);

});

// create posts page
router.get('/create', checkLogin, function(req, res, next) {
  res.render('create');
});

//posts/:postId -> a article
router.get('/:postId', function(req, res, next) {
  var postID = req.params.postId;

  //get posts
  var getPost = PostModel.getPostById(postID)
  .then(function(result) {
    // console.log('middle1: '+ result);
    return create_at.afterFindOne(result)
  })
  .then(function(result) {
    // console.log('middle2: '+ result);
    return markdownToHTML.M2H_AfterFindOne(result)
  });

  //update pv
  var pv = PostModel.increasePv(postID);

  function handler(posts, Pv) {
    // var post = result;
    if (!posts) {
      throw new Error('该文章不存在!');
    }
    // console.log('result: ' + posts);
    res.render('post', { post: posts });
  };

  Promise.all([getPost, pv]).then(([posts, Pv]) => handler(posts, Pv));
});

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function(req, res, next) {
  res.send(req.flash());
});

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function(req, res, next) {
  res.send(req.flash());
});

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function(req, res, next) {
  res.send(req.flash());
});

// POST /posts/:postId/comment 创建一条留言
router.post('/:postId/comment', checkLogin, function(req, res, next) {
  res.send(req.flash());
});

// GET /posts/:postId/comment/:commentId/remove 删除一条留言
router.get('/:postId/comment/:commentId/remove', checkLogin, function(req, res, next) {
  res.send(req.flash());
});

module.exports = router;
