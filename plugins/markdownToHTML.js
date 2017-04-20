var marked = require('marked');

module.exports = function(schema) {
  var M2H_AfterFind = function(posts) {
    return posts.map(function(post) {
      post.content = marked(post.content);
      return post;
    });
  };

  var M2H_AfterFindOne = function(post) {
    if (post) {
      post = marked(post.content);
    }
    return post;
  };

  schema.post('find', M2H_AfterFind);
  schema.post('findOne', M2H_AfterFindOne);
}
