var config = require('config-lite');
// var Mongolass = require('mongolass');
var mongoose = require('mongoose');

//create time stamp
var idToCreateTime = require('../plugins/create_at');

//var mongolass = new Mongolass();
//mongolass.connect(config.mongodb);
mongoose.connect(config.mongodb);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',function(){
      console.log("success open db!");
    });

var Schema = mongoose.Schema;

//user schema
var userSchema = new Schema({
  name: {
    type: String
  },
  password: {
    type: String
  },
  avatar: {
    type: String
  },
  gender: {
    type: String,
    enum: ['m', 'f', 'x']
  },
  bio: {
    type: String
  }
});
//schema level index
userSchema.index({ name: 1 }, { unique: true });
//add plugin
userSchema.plugin(idToCreateTime);
//create user model
exports.User = mongoose.model('User', userSchema);
