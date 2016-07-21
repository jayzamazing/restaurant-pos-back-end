/*jshint esversion: 6 */
(function() {
    "use strict";
    var bcrypt = require('bcrypt');
    //import mongoose
    var mongoose = require('mongoose');
    //set the schema for this collection
    var UserSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            require: true
        }
    });
    UserSchema.pre('save', function(next) {
      var context = this;
      if (context.isModified('password')) {
        bcrypt.genSalt(10, function(err, salt) {
          if (err) {
            return next(err);
          }
          bcrypt.hash(context.password, salt, function(err, hash) {
            if (err) {
              return next(err);
            }
            context.password = hash;
            next();
          });
        });
      }
    });
    //create collection variable based on schema
    var User = mongoose.model('User', UserSchema);

    /*
    * Function to save the user credentials in the mongo db
    * @resolve/reject - success/error message
    */
    User.prototype.saveCredentials = function() {
      var context = this;
        return new Promise(function(resolve, reject) {
          console.log('here1');
            context.save(function(err) {
              console.log('here2');
              if (err) {
                reject('Server Error');
              }
              console.log('here3');
              resolve('Saved user credentials');
            });
        });
    };
    User.validatePassword = function(password) {
      var context = this;
      return new Promise(function(resolve, reject) {
        bcrypt.compare(password, context.password, function(err, valid) {
          if (err) {
            reject(err);
          }
          resolve(valid);
        });
      });
    };
    module.exports = User;
})();
