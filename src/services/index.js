'use strict';
const table = require('./table');
const store = require('./store');
const menu = require('./menu');
const authentication = require('./authentication');
const user = require('./user');
const mongoose = require('mongoose');
module.exports = function() {
  const app = this;

  mongoose.connect(app.get('mongodb'));
  mongoose.Promise = global.Promise;

  app.configure(authentication);
  app.configure(user);
  app.configure(menu);
  app.configure(store);
  app.configure(table);
};
