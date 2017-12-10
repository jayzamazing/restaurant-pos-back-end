'use strict';
const mongoose = require('mongoose');

const options = {
  toObject: {getters: true},
  toJSON: {getters: true}
};
//schema representing a card
const tableSchema = new mongoose.Schema({
  tableId: { type: Number, required: true },
  checkNumber: { type: Number, required: true },
  order: [{
    dish: { type: mongoose.Schema.Types.ObjectId, ref: 'menu' },
    notes: { type: String }
  }],
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
}, options);
//format and return data
tableSchema.methods.apiRepr = function() {
  return {
    _id: this._id,
    tableId: this.tableId,
    checkNumber: this.checkNumber,
    order: this.order
  };
};
const Table = mongoose.model('table', tableSchema);

module.exports = {Table};
