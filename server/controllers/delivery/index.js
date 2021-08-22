const deliveryController = require('./delivery.controller');
const express = require("express");
const router = express.Router();
const accessControl = require('../../_helper/authorize');

router.post("/requestDelivery/:quoteId", accessControl.authorize, deliveryController.request);
router.get("/getAll/:id", accessControl.IsLogged, deliveryController.getAllDelivery);
router.get("/filter/:startDate?/:endDate?/:limit?", accessControl.authorize, deliveryController.filterDelivery);
router.get("/:id", accessControl.authorize, deliveryController.getDelivery);
router.put("/:id", accessControl.authorize, deliveryController.upsertDelivery);
router.delete("/:id", accessControl.authorize, deliveryController.cancelDelivery);

module.exports = router;