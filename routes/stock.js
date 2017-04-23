var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


//db models
var GushenquModel = require('../models/GushenModel');
// tradelikewater 范德依彪 http://chuansong.me/account/tradelikewater
var FandeyibiaoModel = require('../models/FandeyibiaoModel');
// gufengle 股蜂乐 http://chuansong.me/account/gufengle0509
var GufengleModel = require('../models/GufengleModel');
// hkwoniumei 财经美女蜗牛妹 http://chuansong.me/account/hkwoniumei
var CaijingmeinvModel = require('../models/CaijingmeinvModel');
// cdxiaochunjie 超短小纯杰 http://chuansong.me/account/cdxiaochunjie
var ChaoduanxiaochunjieModel = require('../models/ChaoduanxiaochunjieModel');
// peterlinqi 林奇看盘  http://chuansong.me/account/peterlinqi888
var LinqikanpanModel = require('../models/LinqikanpanModel');
//check
var checkLogin = require('../middlewares/check').checkLogin;
//middlewares
var create_at = require('../middlewares/create_at');
var markdownToHTML = require('../middlewares/markdownToHTML');
var commentOperation = require('../middlewares/commentOperation');


// sign up page
router.get('/', function(req, res, next) {
  // console.log("hello world");

  //result

  var renderInput = {};

  //get GushenquModel
  var getGushenqu = GushenquModel
    .getThreeArticles()
    .then(function(result) {
      // console.log('middle1: '+ result);
      renderInput.Gushenqu = result;
      return result;
    });

  //FandeyibiaoModel
  var getFandeyibiao = FandeyibiaoModel
    .getThreeArticles()
    .then(function(result) {
      renderInput.Fandeyibiao = result;
      return result;
    });
  //GufengleModel
  var getGufengle = GufengleModel
    .getThreeArticles()
    .then(function (result) {
      renderInput.Gufengle = result;
      return result;
    });
  //CaijingmeinvModel
  var getCaijingmeinv = CaijingmeinvModel
    .getThreeArticles()
    .then(function (result){
      renderInput.Caijingmeinv = result;
      return result;
    });
  //ChaoduanxiaochunjieModel
  var getChaoduanxiaochunjie = ChaoduanxiaochunjieModel
    .getThreeArticles()
    .then(function(result) {
      renderInput.Chaoduanxiaochunjie = result;
      return result;
    });
  //LinqikanpanModel
  var getLinqikanpan = LinqikanpanModel
    .getThreeArticles()
    .then(function(result) {
      renderInput.Linqikanpan = result;
      return result;
    });

  function handler(renderInput) {
    // var post = result;
    if (!renderInput) {
      throw new Error('该文章不存在!');
    }
    // console.log('result: ' + posts);
    res.render('stock', { renderInput: renderInput });
  };

  Promise.all([getGushenqu, getFandeyibiao, getGufengle, getCaijingmeinv, getChaoduanxiaochunjie, getLinqikanpan])
    .then(([getGushenqu, getFandeyibiao, getGufengle, getCaijingmeinv, getChaoduanxiaochunjie, getLinqikanpan]) => handler(renderInput))
    .catch(next);
});


// //get data
// var getArticles = function(type, articleId) {
//   type
//   .checkArticleById(articleId)
//   .then(function(result) {
//     res.render('single-stock', { stock: result })
//   })
// }


// sign up page
router.get('/:type/:articleId', function(req, res, next) {
  var type = req.params.type;
  var articleId = req.params.articleId;

  getArticles(type, articleId);

  if (type == 'Gushenqu') {
    GushenquModel
      .checkArticleById(articleId)
      .then(function(result) {
        res.render('single-stock', { stock: result })
      });
  };
  if (type == 'Fandeyibiao') {
    FandeyibiaoModel
    .checkArticleById(articleId)
    .then(function(result) {
      res.render('single-stock', { stock: result })
    });
  };
  if (type == 'Gufengle') {
    GufengleModel
    .checkArticleById(articleId)
    .then(function(result) {
      res.render('single-stock', { stock: result })
    });
  };
  if (type == 'Caijingmeinv') {
    CaijingmeinvModel
    .checkArticleById(articleId)
    .then(function(result) {
      res.render('single-stock', { stock: result })
    });
  };
  if (type == 'Chaoduanxiaochunjie') {
    ChaoduanxiaochunjieModel
    .checkArticleById(articleId)
    .then(function(result) {
      res.render('single-stock', { stock: result });
    });
  };
  if (type == 'Linqikanpan') {
    LinqikanpanModel
    .checkArticleById(articleId)
    .then(function(result) {
      res.render('single-stock', { stock: result })
    });
  };

});

router.get('/:blogName', function(req, res, next) {
    var blogName = req.params.blogName;
    var renderInput = {};

    if (blogName == 'Gushenqu') {
      GushenquModel
        .getArticles()
        .then(function(result) {
          renderInput.blogContent = result;
          renderInput.blogName = "股社区";
          renderInput.picturename = blogName;
          res.render('allstock', { renderInput: renderInput });
        });
    };

    if (blogName == 'Fandeyibiao') {
      FandeyibiaoModel
      .getArticles()
      .then(function(result) {
        renderInput.blogContent = result;
        renderInput.blogName = "范德依彪";
        renderInput.picturename = blogName;
        res.render('allstock', { renderInput: renderInput });
      });
    };

    if (blogName == 'Gufengle') {
      GufengleModel
      .getArticles()
      .then(function(result) {
        renderInput.blogContent = result;
        renderInput.blogName = "股蜂乐";
        renderInput.picturename = blogName;
        res.render('allstock', { renderInput: renderInput });
      });
    };

    if (blogName == 'Caijingmeinv') {
      CaijingmeinvModel
      .getArticles()
      .then(function(result) {
        renderInput.blogContent = result;
        renderInput.blogName = "财经美女蜗牛妹";
        renderInput.picturename = blogName;
        res.render('allstock', { renderInput: renderInput });
      });
    };


    if (blogName == 'Chaoduanxiaochunjie') {
      ChaoduanxiaochunjieModel
      .getArticles()
      .then(function(result) {
        renderInput.blogContent = result;
        renderInput.blogName = "超短小纯杰";
        renderInput.picturename = blogName;
        res.render('allstock', { renderInput: renderInput });
      });
    };


    if (blogName == 'Linqikanpan') {
      LinqikanpanModel
      .getArticles()
      .then(function(result) {
        renderInput.blogContent = result;
        renderInput.blogName = "林奇看盘";
        renderInput.picturename = blogName;
        res.render('allstock', { renderInput: renderInput });
    });
  };



});



module.exports = router;
