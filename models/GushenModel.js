var Gushenqu = require('../lib/mongo').Gushenqu;

module.exports = {

  //create article
  create: function (article) {
    return Gushenqu.create(article);
  },

  //get
  getArticles: function (articleId) {
    var query = {};
    if (articleId) {
      query.articleId = articleId;
    }
    return Gushenqu
      .find(query)
      .sort({ articleId: -1 });
  },

  //get three articles
  getThreeArticles: function () {
    return Gushenqu
      .find({})
      .sort({ articleId: -1 })
      .limit(3);
  },

  //checkArticles
  checkArticleById: function(articleId) {
    return Gushenqu
      .findOne({ articleId: articleId });
  },

  //increse pv
  increasePv: function(articleId) {
    return Gushenqu
      .update({ articleId: articleId }, { $inc: { pv: 1 } });
  }
}
