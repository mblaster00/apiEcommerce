const jwt = require("jsonwebtoken");
const logger = require("./../components/logger/index");
const User = require("../models/users/user.model");
const fs = require("fs");

module.exports = {

    // IsLogged user 
    IsLogged: async function IsLogged(req, res, next) {
        // roles param can be a single role string (e.g. Role.User or 'User')
        // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
        let verifytoken = {
            // if has error in token or expire
            userId: null,
            exp: null,
        };
        if (req.headers["x-access-token"]) {
            const accessToken = req.headers["x-access-token"];
            const verifyOptions = {
                algorithms: [process.env.ALG],
            };
            var publicKey = fs.readFileSync(process.env.PUBLIC_KEY, "utf-8");
            // verify a token symmetric
            const { userId, exp } = await jwt.decode(
                accessToken,
                publicKey,
                verifyOptions,
                (err, decode) => {
                    if (err) {
                        return verifytoken;
                    } else {
                        // success token
                        return {
                            userId: decode.userId,
                            exp: decode.exp,
                        };
                    }
                }
            );
            // Check if token has expired
            if (exp < Date.now().valueOf() / 1000 || exp == null) {
                return res
                    .status(401)
                    .json({
                        error: "JWT token has expired, please login again",
                    });
            }
            res.locals.loggedInUser = await User.findById(userId);
            next();
        } else {
            next();
        }
    },


    // authorize user 
    authorize: async function authorize(req, res, next) {
        // roles param can be a single role string (e.g. Role.User or 'User')
        // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
        let verifytoken = {
            // if has error in token or expire
            keyId: null,
            exp: null,
        };
        if (req.headers["secret-token"]) {
            var secret = req.headers["secret-token"]
            const secretToken = secret.split("|")[0];
            const verifyOptions = {
                algorithms: [process.env.ALG],
            };
            var publicKey = fs.readFileSync(process.env.PUBLIC_KEY, "utf-8");
            // verify a token symmetric
            const { keyId, exp } = await jwt.decode(
                secretToken,
                publicKey,
                verifyOptions,
                (err, decode) => {
                    if (err) {
                        return verifytoken;
                    } else {
                        // success token
                        return {
                            keyId: decode.keyId,
                            exp: decode.exp,
                        };
                    }
                }
            );
            // Check if token has expired
            if (exp < Date.now().valueOf() / 1000 || exp == null) {
                return res
                    .status(401)
                    .json({
                        error: "JWT token has expired, It has been a long time that you don't change your api key",
                    });
            }
            next();
        } else {
            next();
        }
    },

    // verify if user is authenticated
    allowIfLoggedin: function allowIfLoggedin(req, res, next) {
        logger.info(`--- ALLOWIFLOGGEDIN ---`)
        try {
            const user = res.locals.loggedInUser;
            if (!user) {
                logger.info(`--- You need to be logged in to access this route ---`)
                return res.status(401).json({
                    error: "You need to be logged in to access this route",
                });
            }
            logger.info(`--- ALLOWIFLOGGEDIN - online ---`)
            req.user = user;
            next();
        } catch (error) {
            logger.info(`--- Error allowIfLoggedin ---`)
            next(error);
        }
    }
};
