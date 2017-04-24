var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//post model
var PostModel = require('../models/posts');
var CommentModel = require('../models/comments');
var checkLogin = require('../middlewares/check').checkLogin;

//tech model
var ThreeSixKeModel = require('../models/techModel/ThreeSixKeModel');
var HuLianWangPingLunModel = require('../models/techModel/HuLianWangPingLunModel');

//stock model
var GushenModel = require('../models/GushenModel');

//middlewares
var create_at = require('../middlewares/create_at');
var markdownToHTML = require('../middlewares/markdownToHTML');
var commentOperation = require('../middlewares/commentOperation');

// GET /posts all posts
router.get('/', function(req, res, next) {

  var author = req.query.author;

  var redenrInput = {};
  var stock;
  var tech;
  var tech2;

  var getPost = PostModel.getLimitPosts(author,3)
    .then(function(result) {
      return create_at.afterFind(result);
    })
    .then(function(result) {
      return commentOperation.afterFind(result);
    })
    .then(function(result) {
      return markdownToHTML.M2H_AfterFind(result);
    });

  var getStock = GushenModel
    .getThreeArticles()
    .then(function(result) {
      stock = result;
    });

  var getTech = ThreeSixKeModel
    .getThreeArticles()
    .then(function(result) {
      tech = result;
    });

  var getTech2 = HuLianWangPingLunModel
    .getThreeArticles()
    .then(function(result) {
      tech2 = result;
    });

  var handler = function(posts, Pv, comments) {
      // console.log('all: ' + posts);
      //only show part of the post
      res.render('posts', {
        posts: posts,
        stock: stock,
        tech: tech,
        tech2: tech2
      });
    };

    Promise.all([getPost, getStock, getTech, getTech2])
      .then(([posts, Pv, comments, Tech2]) => handler(posts, Pv, comments))
      .catch(next);


});

router.get('/user', function(req, res, next) {
  var author = req.query.author;
  PostModel.getPosts(author)
    .then(function(result) {
      return create_at.afterFind(result);
    })
    .then(function(result) {
      return commentOperation.afterFind(result);
    })
    .then(function(result) {
      return markdownToHTML.M2H_AfterFind(result);
    })
    .then(function(posts) {
      // console.log('all: ' + posts);
      //only show part of the post
      res.render('user-index', {
        posts: posts
      });
    })
    .catch(next);

});

//Get post page
router.get('/all', function(req, res, next) {

  var author = req.query.author;

  PostModel.getPosts(author)
    .then(function(result) {
      return create_at.afterFind(result);
    })
    .then(function(result) {
      return commentOperation.afterFind(result);
    })
    .then(function(result) {
      return markdownToHTML.M2H_AfterFind(result);
    })
    .then(function(posts) {
      // console.log('all: ' + posts);
      //only show part of the post
      res.render('allposts', {
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
      res.redirect(`/posts/${post._id}`);
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
      return commentOperation.afterFindOne(result);
    })
    .then(function(result) {
      // console.log('middle2: '+ result);
      return markdownToHTML.M2H_AfterFindOne(result)
    });

  //update pv
  var pv = PostModel.increasePv(postID);

  //get comments
  var getComment = CommentModel
    .getComments(postID)
    .then(function(result) {
      // console.log('middle1: '+ result);
      return create_at.afterFind(result)
    })
    .then(function(result) {
      // console.log('middle2: '+ result);
      return markdownToHTML.M2H_AfterFind(result)
    });


  function handler(posts, Pv, comments) {
    // var post = result;
    if (!posts) {
      throw new Error('该文章不存在!');
    }
    // console.log('result: ' + posts);
    res.render('post', { post: posts, comments: comments });
  };

  Promise.all([getPost, pv, getComment])
    .then(([posts, Pv, comments]) => handler(posts, Pv, comments))
    .catch(next);
});

// update page
router.get('/:postId/edit', checkLogin, function(req, res, next) {
  var postId = req.params.postId;
  var author = req.session.user._id;

  PostModel.getPostById(postId, author)
    .then(function(result) {
      // console.log('middle1: '+ result);
      return create_at.afterFindOne(result)
    })
    .then(function(result) {
      return commentOperation.afterFindOne(result);
    })
    .then(function(result) {
      // console.log('middle2: '+ result);
      return markdownToHTML.M2H_AfterFindOne(result)
    })
    .then(function(result) {
      if (!result) {
        throw new Error('这文章, 不存在的!');
      }

      if (author.toString() !== result.author._id.toString()) {
        throw new Error('不能修改别人的文章!');
      }

      res.render('edit', { post: result })
    })
    .catch(next);
});

// edit post
router.post('/:postId/edit', checkLogin, function(req, res, next) {
  var author = req.session.user._id;
  var postId = req.params.postId;
  var content = req.fields.content;
  var title = req.fields.title;

  PostModel.updatePostBtId(postId, author, { title: title, content: content })
    .then(function() {
      req.flash('success', '编辑成功!');
      res.redirect(`/posts/${postId}`);
    })
    .catch(next);
});


// GET /posts/:postId/remove
router.get('/:postId/remove', checkLogin, function(req, res, next) {
  var postId = req.params.postId;
  var author = req.session.user._id;

  PostModel.deletePostById(postId, author)
    .then(function (res) {
      // 文章删除后，再删除该文章下的所有留言
      if (res.result.ok && res.result.n > 0) {
        return CommentModel.deleteCommentByPostId(postId);
      }
    })
    .then(function () {
      req.flash('success', '删除文章成功!');
      res.redirect('/posts');
    })
    .catch(next);
});

// POST /posts/:postId/comment create comment
router.post('/:postId/comment', checkLogin, function(req, res, next) {
  var author = req.session.user._id;
  var postId = req.params.postId;
  var content = req.fields.content;



  try {
    if (content.length == 0) {
      throw new Error('评论不能为空!');
    }
  } catch(e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }

  //entity
  var comment = {
    author: author,
    postId: postId,
    content: content
  };

  CommentModel.create(comment)
    .then(function () {
      req.flash('success', '留言成功');
      res.redirect('back');
    })
    .catch(next);
});

// GET /posts/:postId/comment/:commentId/remove
router.get('/:postId/comment/:commentId/remove', checkLogin, function(req, res, next) {
  var commentId = req.params.commentId;
  var author = req.session.user._id;

  CommentModel.deleteCommentById(commentId, author)
    .then(function () {
      req.flash('success', '删除留言成功');
      res.redirect('back');
    })
    .catch(next);
});

module.exports = router;
