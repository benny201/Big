var ThreeSixKe = require('../../lib/mongo').ThreeSixKe;

module.exports = {

  //create article
  create: function (article) {
    return ThreeSixKe.create(article);
  },

  //get
  getArticles: function (articleId) {
    var query = {};
    if (articleId) {
      query.articleId = articleId;
    }
    return ThreeSixKe
      .find(query)
      .sort({ articleId: -1 });
  },

  //get three articles
  getThreeArticles: function () {
    return ThreeSixKe
      .find({})
      .sort({ articleId: -1 })
      .limit(3);
  },

  //checkArticles
  checkArticleById: function(articleId) {
    return ThreeSixKe
      .findOne({ articleId: articleId });
  },

  //increse pv
  increasePv: function(articleId) {
    return ThreeSixKe
      .update({ articleId: articleId }, { $inc: { pv: 1 } });
  }
}
