var marked = require('marked');

module.exports = {
  M2H_AfterFind: function(posts) {
    return posts.map(function(post) {
      post.content = marked(post.content);
      return post;
    });
  },

  M2H_AfterFindOne: function(post) {
    if (post) {
      post.content = marked(post.content);
    }
    return post;
  }
}
