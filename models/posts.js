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

  //pv
  increasePv: function(postID) {
    return Post
      .update({ _id: postID }, { $inc: { pv: 1 } });
  }


}
