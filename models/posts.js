var Post = require('../lib/mongo').Post;



module.exports = {
  //create post
  create: function(post) {
    return Post.create(post);
  },
  //get a post by id
  getPostById: function(postID) {
    return Post
    .findOne({ _id: postID })
    .populate({ path: 'author', model: 'User' });
  },
  //update post by id
  updatePostBtId: function(postId, author, data) {
    return Post
      .update({ author: author, _id: postId }, { $set: data });
  },
  //get all post
  getPosts: function(author) {
    var query = {};
    if (author) {
      query.author = author;
    }
    return Post
      .find(query)
      .populate({ path: 'author',  model: 'User' })
      .sort({ _id: -1 });
  },
  //getlimitpost
  getLimitPosts: function(author, num) {
    var query = {};
    var limitNum = num;
    if (author) {
      query.author = author;
    }
    return Post
      .find(query)
      .populate({ path: 'author',  model: 'User' })
      .sort({ _id: -1 })
      .limit(limitNum);
  },

  //delete post by id
  deletePostById: function(postId, author) {
    return Post
      .remove({ author: author, _id: postId });
  },
  //increse pv
  increasePv: function(postID) {
    return Post
      .update({ _id: postID }, { $inc: { pv: 1 } });
  },



}
