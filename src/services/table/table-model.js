'use strict';

// table-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Menu = require('../menu/menu-model.js');

const tableSchema = new Schema({
  tables: {
    tableId: {
      type: Number,
      required: true
    },
    checkNumber: {
      type: Number,
      required: true
    },
    order: [{
        dish: {
          //TODO add menu items
        },
        notes: {
          type: String
        }
    }]
  },
  createdAt: {
    type: Date,
    'default': Date.now
  },
  updatedAt: {
    type: Date,
    'default': Date.now
  }
});


const tableModel = mongoose.model('table', tableSchema);

module.exports = tableModel;
