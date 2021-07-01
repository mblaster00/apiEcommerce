const { authTask } = require('./cronTab/auth');
const mongoose = require("mongoose");
const config = require(`../config/environments/${process.env.NODE_ENV}.js`);

const db = mongoose
    .connect(config.mongo.uri, config.mongo.options)
    .then(() => {
        //console.log("Connected to the Database successfully");
    });

module.exports = () => {
    db.then(res => {
        authTask
    });
}
