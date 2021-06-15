/**
 * Express configuration
 */
 const express = require("express");
 const config = require("./environments");
 const cookieParser = require("cookie-parser");
 const path = require("path");
 
 module.exports = (app) => {
   app.set("appPath", path.join(config.root, "client"));
   app.use(express.static(app.get("appPath")));
   app.set('trust proxy', 'loopback');
   app.set("views", `${config.root}/server/views`);
   app.engine("html", require("ejs").renderFile);
   app.set("view engine", "html");
   app.use(function (req, res, next) {
     res.setHeader("Access-Control-Allow-Origin", "*");
     res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS,GET,PUT,PATCH,DELETE");
     res.setHeader("Access-Control-Allow-Headers",  "*");
     res.setHeader("Access-Control-Allow-Credentials", true);
     next();
   });
   app.use(cookieParser());
 };