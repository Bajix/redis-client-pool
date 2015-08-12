var hash = require('object-hash'),
  config = require('config'),
  redis = require('redis'),
  util = require('util'),
  clients = {};

function createClient( options, poolClient ) {
  if (typeof options === 'string') {
    options = config.redis[options];
  }

  options = util._extend({
    host: '127.0.0.1',
    port: 6379,
    database: 0
  }, options);

  var ID = hash(options),
    client;

  if (poolClient && clients.hasOwnProperty(ID)) {
    return clients[ID];
  }

  var database = options.database,
    socket = options.socket,
    host = options.host,
    port = options.port;

  delete options.database;
  delete options.socket;
  delete options.host;
  delete options.port;

  client = socket ? redis.createClient(socket, options) : redis.createClient(port, host, options);

  if (database) {
    client.select(database);
  }

  if (poolClient) {
    clients[ID] = client;
  }

  return client;
}

Object.defineProperty(exports, 'createClient', {
  value: createClient,
  configurable: false,
  enumerable: false,
  writeable: false
});

Object.keys(config.redis).forEach(function( key ) {
  var client;

  Object.defineProperty(exports, key, {
    get: function() {
      if (!client) {
        client = createClient(key, true);
      }

      return client;
    },
    configurable: false,
    enumerable: true,
    writeable: false
  });
});