// server/models/pricing.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PricingSchema = new Schema({
    pickupLocationCountry: [String],
    dropoffLocationCountry: [String],
    pricePerKilogram: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    created_at: Date
});

const Pricing = mongoose.model("Pricing", PricingSchema);
module.exports = Pricing;