'use strict';

const service = require('feathers-mongoose');
const table = require('./table-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: table,
    paginate: {
      default: 100,
      max: 100
    }
  };

  // Initialize our service with any options it requires
  app.use('/tables', service(options));

  // Get our initialize service to that we can bind hooks
  const tableService = app.service('/tables');

  // Set up our before hooks
  tableService.before(hooks.before);

  // Set up our after hooks
  tableService.after(hooks.after);
};
