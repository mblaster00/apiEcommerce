const quotationController = require('./quotation.controller');
const express = require("express");
const router = express.Router();

router.post("/requestQuote", quotationController.request);

module.exports = router;