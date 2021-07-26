const quotationController = require('./quotation.controller');
const express = require("express");
const router = express.Router();
const accessControl = require('../../_helper/authorize');

router.post("/requestQuote", accessControl.authorize, quotationController.request);
router.get("/:id", accessControl.authorize, quotationController.getQuotation);
router.delete("/:id", accessControl.authorize, quotationController.cancelQuotation);

module.exports = router;