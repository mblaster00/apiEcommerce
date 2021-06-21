const userController = require('./user.controller');
const express = require("express");
const router = express.Router();
const accessControl = require('../../_helper/authorize');

router.post("/register", userController.signup);
router.post("/login", userController.login);

module.exports = router;