'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const options = {
  toObject: {getters: true},
  toJSON: {getters: true}
};
//schema representing a user
const storeSchema = mongoose.Schema({
  storeNumber: {type: Number, required: true, unique: true},
  storeName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  stateTax: { type: Number, required: true },
  recommendedTip: { type: Number, required: true },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
}, options);

storeSchema.methods.apiRepr = function() {
  return {
    _id: this._id,
    storeNumber: this.storeNumber,
    storeName: this.storeName,
    address: this.address,
    city: this.city,
    state: this.state,
    zipCode: this.zipCode,
    stateTax: this.stateTax,
    recommendedTip: this.recommendedTip
  };
};

const Store = mongoose.model('store', storeSchema);

module.exports = {Store};
