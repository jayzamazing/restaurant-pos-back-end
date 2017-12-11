'use strict';
const mongoose = require('mongoose');
//used to delete the database
const deleteDb = () => {
  return mongoose.connection.db.dropDatabase();
};
module.exports = {deleteDb};
