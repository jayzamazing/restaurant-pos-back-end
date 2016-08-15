'use strict';

// table-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tableSchema = new Schema({
  tables: [{
    tableId: {
      type: Number,
      unique: true,
      required: true
    },
    order: [{
      dish: {
        name: {
          type: String,
          required: true
        },
        notes: {
          type: String
        },
        cost: {
          type: Number,
          required: true
        }
      }
    }]
  }],
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

const tableModel = mongoose.model('table', tableSchema);

module.exports = tableModel;
