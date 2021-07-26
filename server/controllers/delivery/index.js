const deliveryController = require('./delivery.controller');
const express = require("express");
const router = express.Router();
const accessControl = require('../../_helper/authorize');

router.post("/requestDelivery/:quoteId", accessControl.authorize, deliveryController.request);
router.get("/getAll", accessControl.authorize, deliveryController.getAllDelivery);
router.get("/:id", accessControl.authorize, deliveryController.getDelivery);
router.delete("/:id", accessControl.authorize, deliveryController.cancelDelivery);

module.exports = router;