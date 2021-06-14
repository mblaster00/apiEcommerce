// Imports
var express = require("express");
var userController = require('./routes/users/user.controller');

// Routes
exports.router = (function(){
    var apiRouter = express.Router();


    // Users routes
    apiRouter.route("/users/register/").post(userController.register);
    apiRouter.route("/users/login/").post(userController.register);

    return apiRouter;

})();