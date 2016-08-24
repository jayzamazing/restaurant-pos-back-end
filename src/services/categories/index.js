'use strict';

const service = require('feathers-mongoose');
const categories = require('./categories-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: categories,
    paginate: {
      default: 25,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/categories', service(options));

  // Get our initialize service to that we can bind hooks
  const categoriesService = app.service('/categories');

  // Set up our before hooks
  categoriesService.before(hooks.before);

  // Set up our after hooks
  categoriesService.after(hooks.after);
};
