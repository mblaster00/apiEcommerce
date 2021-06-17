'use strict';

var express = require('express');
var controllerPricing = require('./pricing');

var router = express.Router();

router.get('/createPricing', controllerPricing.CreatePricing);

module.exports = router;
