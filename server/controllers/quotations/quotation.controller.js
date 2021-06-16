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
    logger.info(`-- USER.REQUEST -- start function --`);
    try {
        const quotation = new Quotation()
        quotation.pickupLocationState = req.body.pickupLocationState
        quotation.pickupLocationState = req.body.pickupLocationState
        quotation.pickupLocationAddress = req.body.pickupLocationAddress
        quotation.pickupLocationCity = req.body.pickupLocationCity
        quotation.dropoffLocationState = req.body.dropoffLocationState
        quotation.dropoffLocationCountry = req.body.dropoffLocationCountry
        quotation.dropoffLocationAddress = req.body.dropoffLocationAddress
        quotation.dropoffLocationCity = req.body.dropoffLocationCity
        quotation.items = req.body.items
        quotation.itemsCurrencyCode = req.body.itemsCurrencyCode
        quotation.save()
        const user = await User.findOne({
            $or: [{ phone: username }, { email: username }],
        });
  
        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) return res.status(403).json({ message: "Password is not correct" });
        
        logger.info(`-- USER.REQUEST -- saved`);
        const lastLogin = moment.tz(Date.now(), config.timezone.zone);
        return await User.findByIdAndUpdate(user._id, { accessToken, lastLogin })
            .exec()
            .then((result) => {
                logger.info(`-- USER.RESQUEST -- SUCCESSFULLY`);
                res.status(200).json({
                    data: {
                        _id: result._id,
                        username: result.username
                    },
                    accessToken,
                });
            })
            .catch((error) => {
                logger.info(
                    `-- USER.REQUEST-- : ${error.toString()}`
                );
            });
    } catch (error) {
        logger.info(
            `-- USER.REQUEST-- : ${error.toString()}`
        );
    }
};