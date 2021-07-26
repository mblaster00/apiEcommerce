const apiKeyController = require('./apiKey.controller');
const express = require("express");
const router = express.Router();
const accessControl = require('../../_helper/authorize');

router.get("/:userId", accessControl.IsLogged, apiKeyController.getApiKey);

module.exports = router;