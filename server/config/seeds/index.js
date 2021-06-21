'use strict';

var express = require('express');
var controllerPricing = require('./pricing');
var controllerUser = require('./user');
var controllerItem = require('./items');

var router = express.Router();

router.get('/createPricing', controllerPricing.createPricing);
router.get('/createUsers', controllerUser.createUser);
router.get('/createItems', controllerItem.createItem);

module.exports = router;