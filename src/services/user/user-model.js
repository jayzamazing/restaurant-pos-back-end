'use strict';

// user-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
//import mongoose
const mongoose = require('mongoose');
//get schema from mongoose
const Schema = mongoose.Schema;
//create schema object
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  },
  roles: [{
    type: String,
    required: true
  }],
createdAt: {
  type: Date,
  'default': Date.now
},
updatedAt: {
  type: Date,
  'default': Date.now
}
});
//set the schema for this collection
const userModel = mongoose.model('user', userSchema);
//export for use elsewhere
module.exports = userModel;
