'use strict';
/*eslint no-process-env:0*/

const _ = require('lodash');
const path = require('path');

console.log('environment from config ==>',process.env.NODE_ENV)

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,
  // Root path of server
  root: path.normalize(`${__dirname}/../..`),
};

module.exports = _.merge(
all,
require(`./${process.env.NODE_ENV}.js`) || {}
)