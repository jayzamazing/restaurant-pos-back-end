'use strict';
const mongoose = require('mongoose');

const options = {
  toObject: {getters: true},
  toJSON: {getters: true}
};
//schema representing a board
const counterSchema = new mongoose.Schema({
  checkNumber: { type: Number, required: true, unique: true },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
}, options);
//check if updatedAt date is less than the current date
counterSchema.methods.checkDate = function() {
  return (new Date(this.updatedAt)).getDate() < (new Date()).getDate();
}

const Counter = mongoose.model('counter', counterSchema);

module.exports = {Counter};
