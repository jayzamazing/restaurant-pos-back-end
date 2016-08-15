'use strict';

// store-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
  storeNumber: {
    type: Number,
    unique: true,
    required: true
  },
  storeName: {
      type: String,
      unique: true,
      required: true
  },
  address: {
      type: String,
      required: true
  },
  city: {
      type: String,
      required: true
  },
  state: {
      type: String,
      required: true
  },
  zipCode: {
      type: String,
      required: true
  },
  stateTax: {
      type: Number,
      required: true
  },
  recommendedTip: {
      type: Number,
      required: true
  },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

const storeModel = mongoose.model('store', storeSchema);

module.exports = storeModel;
