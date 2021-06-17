const deliveryController = require('./delivery.controller');
const express = require("express");
const router = express.Router();

router.post("/requestDelivery", deliveryController.request);

module.exports = router;