var Comment = require('../lib/mongo').Comment;

module.exports = {
  //create comment
  create: function(comment) {
    return Comment.create(comment);
  },

  //delete comment by user id
  deleteCommentById: function(commentId, author) {
    return Comment.remove({ author: author, _id: commentId });
  },

  //delte comment by post id
  deleteCommentByPostId: function(postId) {
    return Comment.remove({ postId: postId });
  },

  //get all comment by postId
  getComments: function(postId) {
    return Comment
      .find({ postId: postId })
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: 1 });
  },

  //get amount of comments
  getCommentCount: function(postId) {
    return Comment
      .count({ postId: postId });
  }
}
