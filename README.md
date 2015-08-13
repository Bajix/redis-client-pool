# **Redis Client Pool**

A [config](https://www.npmjs.com/package/config) driven redis client factory that pools.

The use case here is to create a convience module to ensure that you're able to share redis clients without all the initialization glue.

[![Version npm](https://img.shields.io/npm/v/redis-client-pool.svg?style=flat-square)](https://www.npmjs.com/package/redis-client-pool)[![Support via Gratipay](https://img.shields.io/gratipay/Bajix.svg)](https://gratipay.com/Bajix)[![NPM Downloads](https://img.shields.io/npm/dm/redis-client-pool.svg?style=flat-square)](https://www.npmjs.com/package/redis-client-pool)[![Build Status](https://img.shields.io/codeship/47629180-22d5-0133-a61b-4232491ff1b0.svg)](https://codeship.com/projects/96293)[![Dependencies](https://img.shields.io/david/Bajix/redis-client-pool.svg?style=flat-square)](https://david-dm.org/Bajix/redis-client-pool)


## Install

[![NPM](https://nodei.co/npm/redis-client-pool.png?downloads=true&downloadRank=true)](https://nodei.co/npm/redis-client-pool/)

## Documentation

For each option set defined in `config.redis`, this module will create the respective exportable getter that will either return a cached client, or create a new client and add it into the client cache.

Clients are only created when accessed.

Additionally, for when it's necessary to create redis clients that are not pooled such as for Pub/Sub applications, `createClient` is also exposed.

### `createClient(options, poolClient)`

`options` *{Object OR String}*

Redis configuration settings. If passed a string, this will use the respective settings from `config.redis`.

In addition to the configuration options listed [redis](https://www.npmjs.com/package/redis), the following are supported:

- `host` *{String}*
- `port` *{Number}*
- `socket` *{String}*
- `database` *{Number}*

If database is present, this will automatically select the respective database.

`poolClient` *{Boolean}*

Optional. If enabled, this will find a cached client, or create a new client and add it into the client cache.

Do not pool Pub/Sub clients.

## Example

```
// .
// ├── config
// │   ├── default.json
// │   └── test.json

// default.json
//   "redis" : {
//     "utility" : {
//       "host" : "localhost",
//       "port" : 6379,
//       "database" : 0
//     },
//     "session" : {
//       "host" : "localhost",
//       "port" : 6379,
//       "database" : 0
//     },
//     "kue" : {
//       "host" : "localhost",
//       "port" : 6379,
//       "database" : 2
//     }
//   },
//  "session" : {
//    "ttl" : 2592000000,
//    "secure" : false
//  },
//  "cookie" : {
//    "secret" : "install me!"
//  }
// }

var client = require('redis-client-pool').session,
  session = require('express-session'),
  config = require('config');

var RedisStore = require('connect-redis')(session);

var store = new RedisStore({
  client: client,
  ttl: config.session.ttl
});
```