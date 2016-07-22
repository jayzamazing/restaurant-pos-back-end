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
    /*
    * Pre-hook to deal with hashing password before saving it to mongodb
    * @param next - tell when it is done and to move to next task
    */
    UserSchema.pre('save', function(next) {
      //keep current context
      var context = this;
      //only work if password is new or changed
      if (context.isModified('password')) {
        //create salt to be used to create hash
        bcrypt.genSalt(10, function(err, salt) {
          if (err) {
            return next(err);
          }
          //created encrypted password using salt
          bcrypt.hash(context.password, salt, function(err, hash) {
            if (err) {
              return next(err);
            }
            //set password as encrypted password
            context.password = hash;
            //move onto next task
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
      //keep current context
      var context = this;
        return new Promise(function(resolve, reject) {
          //return promise so this can be used in a promise chain
            context.save(function(err) {
              //if there is any error, send error back
              if (err) {
                reject('Server Error');
              }
              //send back success message
              resolve('Saved user credentials');
            });
        });
    };
    /*
    * Function to validate a given password against hashed version
    * @param password - password to validate
    * @resolve/reject - success/error message
    */
    User.prototype.validatePassword = function(password) {
      var context = this;
      return new Promise(function(resolve, reject) {
        bcrypt.compare(password, context.password, function(err, valid) {
          //if there is any error, send error back
          if (err) {
            reject(err);
          }
          //send back success message, either true or false
          resolve(valid);
        });
      });
    };
    module.exports = User;
})();
