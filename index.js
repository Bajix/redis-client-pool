const {EventEmitter} = require('events'),
  crypto = require('crypto'),
  config = require('config'),
  redis = require('redis'),
  url = require('url');

config.util.setModuleDefaults('redis', {});

const options = config.redis.options || {};

const Pool = Object.create(EventEmitter.prototype);

const clients = {};

EventEmitter.call(Pool);

Pool.createClient = function( uri, poolClient ) {
  if (config.redis.hasOwnProperty(uri)) {
    uri = config.redis[uri];
  }

  let ID = crypto.createHash('md5').update(uri).digest('hex');

  if (poolClient && clients.hasOwnProperty(ID)) {
    return clients[ID];
  }

  let uriParts = url.parse(uri, true),
    database = uriParts.query.database;

  delete uriParts.query;

  let client = redis.createClient(url.format(uriParts), options);

  if (database) {
    client.select(database);
  }

  Pool.emit('client', client);

  if (poolClient) {
    clients[ID] = client;
  }

  return client;
};

Pool.createFactory = function( uri, poolClient ) {
  return function() {
    return Pool.createClient(uri, poolClient);
  };
};

Object.keys(config.redis).filter(function( key ) {
  return key !== 'options';
}).forEach(function( key ) {
  var client;

  Object.defineProperty(Pool, key, {
    get: function() {
      if (!client) {
        client = Pool.createClient(key, true);
      }

      return client
    },
    configurable: false,
    enumerable: true,
    writeable: false
  });
});

module.exports = Pool;