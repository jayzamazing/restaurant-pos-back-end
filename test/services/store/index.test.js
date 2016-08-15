'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('store service', function() {
  it('registered the stores service', () => {
    assert.ok(app.service('stores'));
  });
});
