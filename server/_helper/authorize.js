const jwt = require("jsonwebtoken");
const logger = require("./../components/logger/index");
const fs = require("fs");

module.exports = {
    // authorize role user
    authorize: function authorize(roles = []) {
        // roles param can be a single role string (e.g. Role.User or 'User')
        // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
        if (typeof roles === "string") {
            roles = [roles];
        }
        return [
            async (req, res, next) => {
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
                    const { userId, exp } = await jwt.verify(
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
                                error: "JWT token has expired, please login to obtain a new one",
                            });
                    }
                    res.locals.loggedInUser = await User.findById(userId);
                    next();
                } else {
                    next();
                }
            },
        ];
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
