// Imports
var Quotation = require("../../models/quotations/quotation.model");
var logger = require("../../components/logger/index");
var moment = require("moment-timezone");
var jwtUtils = require("../../config/utils/jwt.utils")

// verify if it's the right password
// async function validatePassword(plainPassword, hashedPassword) {
//     return await bcrypt.compare(plainPassword, hashedPassword);
// }

// authentification
exports.request = async (req, res, next) => {
    logger.info(`-- REQUEST.QUOTE -- start function --`);
    try {
        const quotation = new Quotation(req.body)
        const user = await User.findOne({
            $or: [{ phone: username }, { email: username }],
        });
        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) return res.status(403).json({ message: "Password is not correct" });

        logger.info(`-- REQUEST.QUOTE -- saved`);
        const lastLogin = moment.tz(Date.now(), config.timezone.zone);
        return await quotation.save()
            .then((response) => {
                logger.info("-- NEW.QUOTATION --" + `new user saved : ${user._id}`);
                return res.status(201).json({
                    data: { _id: response._id },
                    accessToken: response.accessToken,
                });
            })
            .catch((error) => {
                logger.info(
                    `-- QUOTATION.ERROR-- error : ${error}`
                );
            });
    } catch (error) {
        logger.info(
            `-- QUOTATION.ERROR-- : ${error.toString()}`
        );
    }
};