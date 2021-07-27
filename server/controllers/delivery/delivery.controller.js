// Imports
var Delivery = require("../../models/delivery/delivery.model");
var Quotation = require("../../models/quotations/quotation.model");
var Tracking = require("../../models/tracking/tracking.model");
var Statu = require("../../models/statu/statu.model");
var Location = require("../../models/location/location.model");
const generateNumber = require("../../config/generateNumber")
var logger = require("../../components/logger/index");
const errorHandler = require('../../_helper/error-handler');
const accessControl = require('../../_helper/authorize');

// create Tracking
async function createTracking(delivery) {
    let trackingNumber;
    let statusId;
    let locationId;
    let idUser;
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
        await accessControl.getIdUser(req).then(response => {
            idUser = response
        });
        const update = {
            "$set": {
              "status": "Confirm"
            }
        };
        const newDelivery = {
            pickupClientService: idUser,
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
                await Quotation.findOneAndUpdate({_id: req.params.quoteId}, update).exec()
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
                return res.status(404).json({ error: "Reference Id not found" });
            });
    } catch (error) {
        logger.info(
            `-- DELIVERY.ERROR-- : ${error.toString()}`
        );
    }
};


// cancelDelivery
exports.cancelDelivery = async (req, res, next) => {
    return await Delivery.findById(req.params.id).exec()
        .then(errorHandler.handleEntityNotFound(res))
        .then(errorHandler.removeEntity(res))
        .catch(error => errorHandler.handleError(res, 500, error));
};


// AllDelivery
exports.getAllDelivery = async (req, res, next) => {
    const data = req.params;
    return await Delivery.find({pickupClientService: data.id}).populate('quoteId')
        .exec()
        .then((result) => {
            logger.info(`-- Delivery.FIND -- SUCCESSFULLY`);
            res.status(200).json({ data: result });
        })
        .catch((error) => {
            logger.info(
                `-- Delivery.FIND-- : ${error.toString()}`
            );
            return res.status(404).json({ error: "Reference not found" });
        });
}

// Upserts Delivery
exports.upsertDelivery = async (req, res, next) => {
    if(req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return await Delivery.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true}).exec()
        .then(errorHandler.respondWithResult(res))
        .catch(error => errorHandler.handleError(res, 500, error));
}