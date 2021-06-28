// server/models/keyUser.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApiKeySchema = new Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    secretToken: {
        type: String,
        index: true,
        required: true
    },
    created_at: Date,
    updated_at: Date
});

const ApiKey = mongoose.model("ApiKey", ApiKeySchema);

module.exports = ApiKey;