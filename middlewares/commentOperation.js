var CommentModel = require('../models/comments');

module.exports = {
  afterFind: function(posts) {
    return Promise.all(posts.map(function (post) {
      return CommentModel.getCommentCount(post._id)
        .then(function (commentsCount) {
          post.commentsCount = commentsCount;
          return post;
        });
    }));
  },
  afterFindOne: function (post) {
    if (post) {
      return CommentModel.getCommentCount(post._id).then(function (count) {
        post.commentsCount = count;
        return post;
      });
    }
    return post;
  }

}
