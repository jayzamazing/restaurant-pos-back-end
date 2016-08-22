'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;

exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated()
  ],
  find: [
    auth.restrictToRoles({
      roles: ['admin', 'user']
    })
  ],
  get: [
    auth.restrictToRoles({
      roles: ['admin', 'user']
    })
  ],
  create: [
    auth.restrictToRoles({
      roles: ['admin', 'user']
    })
  ],
  update: [
    auth.restrictToRoles({
      roles: ['admin', 'user']
    })
  ],
  patch: [
    auth.restrictToRoles({
      roles: ['admin', 'user']
    })
  ],
  remove: [
    auth.restrictToRoles({
      roles: ['admin', 'user']
    })
  ]
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
