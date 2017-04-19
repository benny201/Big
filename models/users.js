var User = require('../lib/mongo').User;

module.exports = {
  //create new user
  create: function(user) {
    return User.create(user);
  },

  //validate user to log in
  getUserByName: function(name) {
    return User
      .findOne({ 'name': name });
  }
};
