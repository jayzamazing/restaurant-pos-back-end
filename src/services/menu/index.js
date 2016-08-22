'use strict';

const service = require('feathers-mongoose');
const menu = require('./menu-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: menu,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/menus', service(options));

  // Get our initialize service to that we can bind hooks
  const menuService = app.service('/menus');

  // Set up our before hooks
  menuService.before(hooks.before);

  // Set up our after hooks
  menuService.after(hooks.after);
};
