var Linqikanpan = require('../lib/mongo').Linqikanpan;

module.exports = {

  //create article
  create: function (article) {
    return Linqikanpan.create(article);
  },

  //get
  getArticles: function (articleId) {
    var query = {};
    if (articleId) {
      query.articleId = articleId;
    }
    return Linqikanpan
      .find(query)
      .sort({ articleId: -1 });
  },

  //get three articles
  getThreeArticles: function () {
    return Linqikanpan
      .find({})
      .sort({ articleId: -1 })
      .limit(3);
  },

  //checkArticles
  checkArticleById: function(articleId) {
    return Linqikanpan
      .findOne({ articleId: articleId });
  },

  //increse pv
  increasePv: function(articleId) {
    return Linqikanpan
      .update({ articleId: articleId }, { $inc: { pv: 1 } });
  }
}
