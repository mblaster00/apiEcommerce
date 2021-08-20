const quotationController = require('./quotation.controller');
const express = require("express");
const router = express.Router();
const accessControl = require('../../_helper/authorize');

router.post("/requestQuote", accessControl.authorize, quotationController.request);
router.get("/:id", accessControl.authorize, quotationController.getQuotation);
router.get("/filter/:startDate/:endDate/:status/:limit", accessControl.authorize, quotationController.filterQuotation);
router.put("/:id", accessControl.authorize, quotationController.upsertQuotation);
router.delete("/:id", accessControl.authorize, quotationController.cancelQuotation);

module.exports = router;