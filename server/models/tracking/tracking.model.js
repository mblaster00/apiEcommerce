const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var TrackingSchema = new Schema({
    trackingNumber: String,
    operationType: String,
    operationId: String,
    origin: String,
    destination: String,
    groupingShippingNumber: Number,
    shippingSteps: [{
        prestationType: String,
        prestationShippingNumber: String,
        createdAt: Date
    }],
    trackingStatus: [{
        statusId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Statu',
            require: false
        },
        locationId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Location',
            require: false
        },
        updatedAt: Date,
        shippingRef: {
            carrierId: {
                type: mongoose.Schema.ObjectId,
                ref: 'Carrier',
                require: false
            },
            carrierTrackingNumber: String
        },
        linkedPrestation: {
            prestationType: String,
            prestationShippingNumber: String,
            prestationId: String
        }
    }],
    createdAt: Date,
    expectedDelivery: Date,
    delayReason: [{
        title: String,
        description: String
    }]
});

const Tracking = mongoose.model("Tracking", TrackingSchema);
module.exports = Tracking;