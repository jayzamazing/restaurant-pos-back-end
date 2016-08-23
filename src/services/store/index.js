'use strict';

const service = require('feathers-mongoose');
const store = require('./store-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: store,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/stores', service(options));

  // Get our initialize service to that we can bind hooks
  const storeService = app.service('/stores');

  // Set up our before hooks
  storeService.before(hooks.before);

  // Set up our after hooks
  storeService.after(hooks.after);
};
