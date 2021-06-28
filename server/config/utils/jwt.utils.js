// Imports
var jwt = require("jsonwebtoken");
var fs = require("fs");
var privateKey = fs.readFileSync(process.env.PRIVATE_KEY, "utf-8");
const signOptions = {
    algorithm: process.env.ALG,
};

// Generate Functions
module.exports = {
    generateToken: function (user) {
        return jwt.sign(
            { userId: user._id, exp: Math.floor(Date.now() / 1000) + 260 * 60 * 1 }, //expire in 1 hour
            privateKey,
            signOptions
        );
    },
    generateSecret: function (apiKey) {
        return jwt.sign(
            { keyId: apiKey._id, exp: Math.floor(Date.now() / 1000) + 260 * 60 * 24 * 365 }, //expire in 1 year
            privateKey,
            signOptions
        );
    }
}