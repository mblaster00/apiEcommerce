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
        const newDelivery = {
            quoteId: req.params.quoteId,
            pickupContactEmail: req.body.pickupContactEmail,
            pickupContactPhoneNumber: req.body.pickupContactPhoneNumber,
            dropoffContactFullName: req.body.dropoffContactFullName,
            dropoffContactEmail: req.body.dropoffContactEmail,
            dropoffContactPhoneNumber: req.body.dropoffContactPhoneNumber,
            created_at: new Date(),
            updated_at: new Date()
        };
        const delivery = new Delivery(newDelivery);
        return await delivery.save()
            .then((de) => {
                logger.info("-- NEW.DELIVERY --" + `new delivery saved : ${delivery._id}`);
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
        return await Delivery.findById(req.params.id).exec()
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