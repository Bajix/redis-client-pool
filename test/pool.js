var clients = require('../index'),
  config = require('config');

describe('Redis Client Pool', function() {
  it('pools clients', function() {
    assert.equal(clients.utility, clients.session);
    assert.notEqual(clients.utility, clients.kue);
  });

  it('clients are enumerable', function() {
    assert.sameMembers(Object.keys(clients), Object.keys(config.redis));
  });
});