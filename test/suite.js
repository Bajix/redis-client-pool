process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
process.env.NODE_ENV = 'test';

var chai = require('chai');

global.assert = chai.assert;
global.expect = chai.expect;