// server/models/delivery.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
    pickupClientService: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    quoteId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Quotation',
        required: true
    },
    pickupContactEmail: {
        type: String,
        required: true
    },
    pickupContactPhoneNumber: {
        type: String,
        required: true,
    },
    dropoffContactFullName: {
        type: String,
        required: true
    },
    dropoffContactEmail: {
        type: String,
        required: true
    },
    dropoffContactPhoneNumber: {
        type: String,
        required: true,
    },
    created_at: Date,
    updated_at: Date
});

const Delivery = mongoose.model("Delivery", DeliverySchema);

module.exports = Delivery;