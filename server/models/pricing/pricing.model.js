// server/models/pricing.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PricingSchema = new Schema({
    pickupLocationCountry: {
        type: String,
        required: true
    },
    dropoffLocationCountry: {
        type: String,
        required: true
    },
    pricePerKiilogram: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    created_at: Date
});

const Pricing = mongoose.model("Pricing", PricingSchema);

module.exports = Pricing;