// Imports
var Delivery = require("../../models/delivery/delivery.model");
var Tracking = require("../../models/tracking/tracking.model");
var Statu = require("../../models/statu/statu.model");
var Location = require("../../models/location/location.model");
const generateNumber = require("../../config/generateNumber")
var logger = require("../../components/logger/index");
const errorHandler = require('../../_helper/error-handler');

// create Tracking
async function createTracking(delivery) {
    let trackingNumber;
    let statusId;
    let locationId;
    const status = await Statu.findOne({ statusCode: 'ATTENTE_VALIDATION' })
    const location = await Location.findOne({ alpha2Code: "SN" });
    if (status) {
        statusId = status._id;
    }
    if (location) {
        locationId = location._id;
    }
    trackingNumber = await generateNumber.getTrackingNumber();
    delivery.trackingNumber = trackingNumber;
    delivery.isOperation = true;
    let newTracking = new Tracking();
    const date = new Date();
    const expectedDelivery = date.setDate(date.getDate() + 5);
    newTracking.expectedDelivery = expectedDelivery;
    newTracking.trackingNumber = trackingNumber;
    newTracking.operationType = 'Delivery';
    newTracking.operationId = delivery._id;
    newTracking.origin = delivery.quoteId.pickupLocationCountry;
    newTracking.destination = delivery.quoteId.dropoffLocationCountry;
    newTracking.createdAt = new Date();
    newTracking.shippingSteps.push({
        prestationType: 'Delivery',
        prestationShippingNumber: null
    });
    newTracking.trackingStatus = {
        statusId: statusId || '',
        locationId: locationId || '',
        updatedAt: new Date(),
        linkedPrestation: {
            prestationType: 'Delivery',
            prestationShippingNumber: null,
            prestationId: delivery._id
        }
    };
    await newTracking.save();
    return trackingNumber
};

// create Delivery
exports.request = async (req, res, next) => {
    logger.info(`-- REQUEST.QUOTE -- start function --`);
    try {
        logger.info(`-- REQUEST.QUOTE -- saved`);
        let response = { shippingNumber: null, status: null, createdAt: new Date(), trackingNumber: null }
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
            .then(async (delivery) => {
                logger.info("-- NEW.DELIVERY --" + `new delivery saved : ${delivery._id}`);
                let data = await delivery.populate("quoteId").execPopulate()
                await createTracking(data).then((tracking) => {
                    response.trackingNumber = tracking
                });
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
        let response = { shippingNumber: null, status: null, createdAt: new Date() }
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