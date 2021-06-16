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
            { userId: user._id, exp: Math.floor(Date.now() / 1000) + 260 * 60 * 2 }, //expire in 2 hour
            privateKey,
            signOptions
        );
    }
}