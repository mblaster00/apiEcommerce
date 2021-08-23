const { authTask } = require('./cronTab/auth');
const mongoose = require("mongoose");
const config = require(`../config/environments/${process.env.NODE_ENV}.js`);
const db = mongoose.connect(config.mongo.uri, config.mongo.options)
  
module.exports = () => {
    // db.then(() => {
    //     authTask
    // });
}