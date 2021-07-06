// server/models/quotation.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuotationSchema = new Schema({
    pickupLocationState: {
        type: String
    },
    pickupLocationCountry: {
        type: String,
        required: true
    },
    pickupLocationAddress: {
        type: String,
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
        type: String
    },
    items: [{ label: String, quantity: Number, price: Number, weight: Number, size: [] }],
    // items: [{
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Item',
    //     required: true
    // }],
    itemsCurrencyCode: {
        type: String,
        required: true
    },
    created_at: Date
});

const Quotation = mongoose.model("Quotation", QuotationSchema);
module.exports = Quotation;