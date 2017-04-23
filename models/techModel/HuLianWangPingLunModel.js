var HuLianWangPingLun = require('../../lib/mongo').HuLianWangPingLun;

module.exports = {

  //create article
  create: function (article) {
    return HuLianWangPingLun.create(article);
  },

  //get
  getArticles: function (articleId) {
    var query = {};
    if (articleId) {
      query.articleId = articleId;
    }
    return HuLianWangPingLun
      .find(query)
      .sort({ articleId: -1 });
  },

  //get three articles
  getThreeArticles: function () {
    return HuLianWangPingLun
      .find({})
      .sort({ articleId: -1 })
      .limit(3);
  },

  //checkArticles
  checkArticleById: function(articleId) {
    return HuLianWangPingLun
      .findOne({ articleId: articleId });
  },

  //increse pv
  increasePv: function(articleId) {
    return HuLianWangPingLun
      .update({ articleId: articleId }, { $inc: { pv: 1 } });
  }
}
