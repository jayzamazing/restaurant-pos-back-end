'use strict';
const mongoose = require('mongoose');

const options = {
  toObject: {getters: true},
  toJSON: {getters: true}
};
//schema representing a board
const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
}, options);
//format and return data
menuSchema.methods.apiRepr = function() {
  return {
    _id: this._id,
    name: this.name,
    categories: categories,

  };
};

//populate all categories
menuSchema.virtual('categories', {
  ref: 'categories',
  localField: '_id',
  foreignField: 'menuId'
});

const Menu = mongoose.model('menu', menuSchema);

module.exports = {Menu};
