var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


//tech models
// DeveloperWorks http://chuansong.me/account/developerWorks
var DeveloperWorksModel = require('../models/techModel/DeveloperWorksModel');
// GuoLin 郭霖 http://chuansong.me/account/guolin_blog
var GuoLinModel = require('../models/techModel/GuoLinModel');
// QianDuanZaoDuKe 前端早读课 http://chuansong.me/account/FeZaoDuKe
var QianDuanZaoDuKeModel = require('../models/techModel/QianDuanZaoDuKeModel');
// QianDuanDaQuan 前端大全 http://chuansong.me/account/FrontDev
var QianDuanDaQuanModel = require('../models/techModel/QianDuanDaQuanModel');
// ThreeSixKe 36氪  http://chuansong.me/account/wow36kr
var ThreeSixKeModel = require('../models/techModel/ThreeSixKeModel');
// HuLianWangPingLun 互联网评论 http://chuansong.me/account/italk007
var HuLianWangPingLunModel = require('../models/techModel/HuLianWangPingLunModel');
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

  //get DeveloperWorksModel
  var getDeveloperWorks = DeveloperWorksModel
    .getThreeArticles()
    .then(function(result) {
      // console.log('middle1: '+ result);
      renderInput.DeveloperWorks = result;
      return result;
    });

  //GuoLinModel
  var getGuoLin = GuoLinModel
    .getThreeArticles()
    .then(function(result) {
      renderInput.GuoLin = result;
      return result;
    });
  //QianDuanZaoDuKeModel
  var getQianDuanZaoDuKe = QianDuanZaoDuKeModel
    .getThreeArticles()
    .then(function (result) {
      renderInput.QianDuanZaoDuKe = result;
      return result;
    });
  //QianDuanDaQuanModel
  var getQianDuanDaQuan = QianDuanDaQuanModel
    .getThreeArticles()
    .then(function (result){
      renderInput.QianDuanDaQuan = result;
      return result;
    });
  //ThreeSixKeModel
  var getThreeSixKe = ThreeSixKeModel
    .getThreeArticles()
    .then(function(result) {
      renderInput.ThreeSixKe = result;
      return result;
    });
  //HuLianWangPingLunModel
  var getHuLianWangPingLun = HuLianWangPingLunModel
    .getThreeArticles()
    .then(function(result) {
      renderInput.HuLianWangPingLun = result;
      return result;
    });

  function handler(renderInput) {
    // var post = result;
    if (!renderInput) {
      throw new Error('该文章不存在!');
    }
    // console.log('result: ' + posts);
    res.render('tech', { renderInput: renderInput });
  };

  Promise.all([getDeveloperWorks, getGuoLin, getQianDuanZaoDuKe, getThreeSixKe, getQianDuanDaQuan, getHuLianWangPingLun])
    .then(([getDeveloperWorks, getGuoLin, getQianDuanZaoDuKe, getThreeSixKe, getQianDuanDaQuan, getHuLianWangPingLun]) => handler(renderInput))
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

  // getArticles(type, articleId);

  if (type == 'DeveloperWorks') {
    DeveloperWorksModel
      .checkArticleById(articleId)
      .then(function(result) {
        res.render('single-tech', { tech: result });
      });
  };
  if (type == 'GuoLin') {
    GuoLinModel
    .checkArticleById(articleId)
    .then(function(result) {
      res.render('single-tech', { tech: result });
    });
  };
  if (type == 'QianDuanZaoDuKe') {
    QianDuanZaoDuKeModel
    .checkArticleById(articleId)
    .then(function(result) {
      res.render('single-tech', { tech: result });
    });
  };
  if (type == 'QianDuanDaQuan') {
    QianDuanDaQuanModel
    .checkArticleById(articleId)
    .then(function(result) {
      res.render('single-tech', { tech: result });
    });
  };
  if (type == 'ThreeSixKe') {
    ThreeSixKeModel
    .checkArticleById(articleId)
    .then(function(result) {
      res.render('single-tech', { tech: result });
    });
  };
  if (type == 'HuLianWangPingLun') {
    HuLianWangPingLunModel
    .checkArticleById(articleId)
    .then(function(result) {
      res.render('single-tech', { tech: result });
    });
  };

});

router.get('/:blogName', function(req, res, next) {
    var blogName = req.params.blogName;
    var renderInput = {};

    if (blogName == 'DeveloperWorks') {
      DeveloperWorksModel
        .getArticles()
        .then(function(result) {
          renderInput.blogContent = result;
          renderInput.blogName = "DeveloperWorks";
          renderInput.picturename = blogName;
          res.render('alltech', { renderInput: renderInput });
        });
    };

    if (blogName == 'GuoLin') {
      GuoLinModel
      .getArticles()
      .then(function(result) {
        renderInput.blogContent = result;
        renderInput.blogName = "郭霖";
        renderInput.picturename = blogName;
        res.render('alltech', { renderInput: renderInput });
      });
    };

    if (blogName == 'QianDuanZaoDuKe') {
      QianDuanZaoDuKeModel
      .getArticles()
      .then(function(result) {
        renderInput.blogContent = result;
        renderInput.blogName = "前端早读课";
        renderInput.picturename = blogName;
        res.render('alltech', { renderInput: renderInput });
      });
    };

    if (blogName == 'QianDuanDaQuan') {
      QianDuanDaQuanModel
      .getArticles()
      .then(function(result) {
        renderInput.blogContent = result;
        renderInput.blogName = "前端大全";
        renderInput.picturename = blogName;
        res.render('alltech', { renderInput: renderInput });
      });
    };


    if (blogName == 'ThreeSixKe') {
      ThreeSixKeModel
      .getArticles()
      .then(function(result) {
        renderInput.blogContent = result;
        renderInput.blogName = "36氪";
        renderInput.picturename = blogName;
        res.render('alltech', { renderInput: renderInput });
      });
    };


    if (blogName == 'HuLianWangPingLun') {
      HuLianWangPingLunModel
      .getArticles()
      .then(function(result) {
        renderInput.blogContent = result;
        renderInput.blogName = "互联网评论";
        renderInput.picturename = blogName;
        res.render('alltech', { renderInput: renderInput });
    });
  };



});



module.exports = router;
