var GuoLin = require('../../lib/mongo').GuoLin;

module.exports = {

  //create article
  create: function (article) {
    return GuoLin.create(article);
  },

  //get
  getArticles: function (articleId) {
    var query = {};
    if (articleId) {
      query.articleId = articleId;
    }
    return GuoLin
      .find(query)
      .sort({ articleId: -1 });
  },

  //get three articles
  getThreeArticles: function () {
    return GuoLin
      .find({})
      .sort({ articleId: -1 })
      .limit(3);
  },

  //checkArticles
  checkArticleById: function(articleId) {
    return GuoLin
      .findOne({ articleId: articleId });
  },

  //increse pv
  increasePv: function(articleId) {
    return GuoLin
      .update({ articleId: articleId }, { $inc: { pv: 1 } });
  }
}
