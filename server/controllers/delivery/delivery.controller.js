// Imports
var Delivery = require("../../models/delivery/delivery.model");
var logger = require("../../components/logger/index");

// create Quotation
exports.request = async (req, res, next) => {
    logger.info(`-- REQUEST.QUOTE -- start function --`);
    try {
        logger.info(`-- REQUEST.QUOTE -- saved`);
        let response = { shippingNumber: null, status: null, createdAt: new Date()}
        return await Delivery.create(req.body)
            .then(() => {
                logger.info("-- NEW.DELIVERY --" + `new delivery saved : ${user._id}`);
                return res.status(201).json({ data: response });
            })
            .catch((error) => {
                logger.info(
                    `-- DELIVERY.ERROR-- error : ${error}`
                );
            });
    } catch (error) {
        logger.info(
            `-- DELIVERY.ERROR-- : ${error.toString()}`
        );
    }
};