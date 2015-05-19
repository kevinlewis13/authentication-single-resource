'use strict';

var mongoose = require('mongoose');
var eat = require ('eat');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  username: String,
  basic: {
    email: {
      type: String,
      unique: true
    },
    password: String
  }
});

userSchema.methods.generateSalt = function() {
  bcrypt.genSalt(8, function (err, salt) {

   // console.log(salt + ' SALT');

    return salt;
  });
};
userSchema.methods.generateHash = function(password, salt, callback) {
  bcrypt.hash(password, salt, null, function (err, hash) {
    return callback(err, hash);
  });
};

userSchema.methods.checkPassword = function(password, callback) {
  bcrypt.compare(password, this.basic.password, function (err, res) {

   // console.log(res + ' RES');

    return callback(err, res);
  });
};

userSchema.methods.generateToken = function(secret, callback) {
  eat.encode({id: this._id}, secret, callback);
};

userSchema.methods.owns = function(book) {
  return book.ownerId === this._id;
};

module.exports = mongoose.model('User', userSchema);
