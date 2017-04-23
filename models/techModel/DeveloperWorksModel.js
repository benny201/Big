var DeveloperWorks = require('../../lib/mongo').DeveloperWorks;

module.exports = {

  //create article
  create: function (article) {
    return DeveloperWorks.create(article);
  },

  //get
  getArticles: function (articleId) {
    var query = {};
    if (articleId) {
      query.articleId = articleId;
    }
    return DeveloperWorks
      .find(query)
      .sort({ articleId: -1 });
  },

  //get three articles
  getThreeArticles: function () {
    return DeveloperWorks
      .find({})
      .sort({ articleId: -1 })
      .limit(3);
  },

  //checkArticles
  checkArticleById: function(articleId) {
    return DeveloperWorks
      .findOne({ articleId: articleId });
  },

  //increse pv
  increasePv: function(articleId) {
    return DeveloperWorks
      .update({ articleId: articleId }, { $inc: { pv: 1 } });
  }
}
