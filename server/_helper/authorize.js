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
            (req, res, next) => {
                const authHeader = req.headers["x-access-token"];
                if (authHeader) {
                    const verifyOptions = {
                        algorithm: process.env.ALG,
                    };
                    var publicKey = fs.readFileSync(process.env.PUBLIC_KEY, "utf-8");
                    jwt.verify(
                        authHeader,
                        publicKey,
                        verifyOptions,
                        async (err, user) => {
                            // authentication and authorization successful
                            next();
                        }
                    );
                } else {
                    // user's role is not authorized
                    return res.status(401).json({ message: "Unauthorized" });
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
