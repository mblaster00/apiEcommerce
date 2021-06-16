// server/models/quotation.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuotationSchema = new Schema({
    accessToken: {
        type: String,
    },
    pickupLocationState: {
        type: String,
        lowercase: true
    },
    pickupLocationCountry: {
        type: String,
        lowercase: true,
        required: true
    },
    pickupLocationAddress: {
        type: String,
        lowercase: true,
        required: true
    },
    pickupLocationCity: {
        type: String
    },
    dropoffLocationState: {
        type: String
    },
    dropoffLocationCountry: {
        type: String,
        required: true
    },
    dropoffLocationAddress: {
        type: String,
        required: true
    },
    dropoffLocationCity: {
        type: String,
        lowercase: true
    },
    items: {
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
        required: true
    },
    itemsCurrencyCode: {
        type: String,
        required: true
    },
    created_at: Date
});

const Quotation = mongoose.model("Quotation", QuotationSchema);

module.exports = Quotation;