var QianDuanZaoDuKe = require('../../lib/mongo').QianDuanZaoDuKe;

module.exports = {

  //create article
  create: function (article) {
    return QianDuanZaoDuKe.create(article);
  },

  //get
  getArticles: function (articleId) {
    var query = {};
    if (articleId) {
      query.articleId = articleId;
    }
    return QianDuanZaoDuKe
      .find(query)
      .sort({ articleId: -1 });
  },

  //get three articles
  getThreeArticles: function () {
    return QianDuanZaoDuKe
      .find({})
      .sort({ articleId: -1 })
      .limit(3);
  },

  //checkArticles
  checkArticleById: function(articleId) {
    return QianDuanZaoDuKe
      .findOne({ articleId: articleId });
  },

  //increse pv
  increasePv: function(articleId) {
    return QianDuanZaoDuKe
      .update({ articleId: articleId }, { $inc: { pv: 1 } });
  }
}
