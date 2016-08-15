'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('table service', function() {
  it('registered the tables service', () => {
    assert.ok(app.service('tables'));
  });
});
