var config = require('config'),
  Pool = require('../index');

describe('Redis Client Pool', function() {

  it('emits new clients', function( done ) {
    Pool.once('client', function( client ) {
      done();
    });

    Pool.createClient('utility', false);
  });

  it('clients pool', function() {
    assert.equal(Pool.utility, Pool.session);
    assert.notEqual(Pool.utility, Pool.kue);
  });
});