// Imports
var Delivery = require("../../models/delivery/delivery.model");
var logger = require("../../components/logger/index");
const errorHandler = require('../../_helper/error-handler');

// create Delivery
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

// getDelivery
exports.getDelivery = async (req, res, next) => {
    logger.info(`-- REQUEST.QUOTE -- start function --`);
    try {
        logger.info(`-- REQUEST.QUOTE -- saved`);
        return await Delivery.findById(req.params.id, '-password').exec()
            .then((delivery) => {
                logger.info("-- GET.DELIVERY --" + `id delivery : ${delivery._id}`);
                return res.status(201).json({ data: delivery });
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


// calcelDelivery
exports.cancelDelivery = async (req, res, next) => {
    logger.info(`-- REQUEST.QUOTE -- start function --`);
    try {
        logger.info(`-- REQUEST.QUOTE -- saved`);
        let response = { shippingNumber: null, status: null, createdAt: new Date()}
        return await Delivery.findByIdAndRemove(req.params.id).exec()
            .then(() => {
                logger.info("-- DELETE.DELIVERY --" + `delivery successfully deleted`);
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