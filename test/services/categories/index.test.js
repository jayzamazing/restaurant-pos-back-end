'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('categories service', function() {
  it('registered the categories service', () => {
    assert.ok(app.service('categories'));
  });
});
