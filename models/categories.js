'use strict';
const mongoose = require('mongoose');

const options = {
  toObject: {getters: true},
  toJSON: {getters: true}
};
//schema representing a board
const categoriesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
}, options);
//format and return data
categoriesSchema.methods.apiRepr = function() {
  return {
    _id: this._id,
    name: this.name
  };
};

const Categories = mongoose.model('categories', categoriesSchema);

module.exports = {Categories};
