// server/models/user.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    quoteId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Quotation',
        required: true
    },
    pickupcontactEmail: {
        type: String,
        required: true
    },
    pickupcontactPhoneNumber: {
        type: String,
        required: true,
    },
    pickupcontactFullName: {
        type: String,
        required: true
    },
    pickupcontactEmail: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: false,
    },
    created_at: Date,
    updated_at: Date
});

const Delivery = mongoose.model("Delivery", DeliverySchema);

module.exports = Delivery;