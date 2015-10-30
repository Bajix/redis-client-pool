var EventEmitter = require('events').EventEmitter,
  crypto = require('crypto'),
  config = require('config'),
  redis = require('redis'),
  util = require('util'),
  url = require('url'),
  clients = {};

var options = config.redis.options || {};

var Pool = Object.create(EventEmitter.prototype);

EventEmitter.call(Pool);

Pool.createClient = function( uri, poolClient ) {
  if (config.redis.hasOwnProperty(uri)) {
    uri = config.redis[uri];
  }

  var ID = crypto.createHash('md5').update(uri).digest('hex');

  if (poolClient && clients.hasOwnProperty(ID)) {
    return clients[ID];
  }

  var uriParts = url.parse(uri, true),
    database = uriParts.query.database;

  delete uriParts.query;

  var client = redis.createClient(url.format(uriParts), options);

  if (database) {
    client.select(database);
  }

  this.emit('client', client);

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