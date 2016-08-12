'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('menu service', function() {
  it('registered the menus service', () => {
    assert.ok(app.service('menus'));
  });
});
