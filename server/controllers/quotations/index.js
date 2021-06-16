const quotationController = require('./quotation.controller');
const express = require("express");
const router = express.Router();

router.post("/requestQuote", userController.request);

module.exports = router;