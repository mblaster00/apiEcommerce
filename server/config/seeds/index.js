'use strict';

var express = require('express');
var controllerPricing = require('./pricing');
var controllerUser = require('./user');

var router = express.Router();

router.get('/createPricing', controllerPricing.createPricing);
router.get('/createUsers', controllerUser.createUser);

module.exports = router;