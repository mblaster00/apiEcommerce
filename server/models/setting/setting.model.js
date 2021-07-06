const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var SettingSchema = new Schema({
    name: { type: String, required: true },
    sequence: { type: Number, default: 0 }
});

const Setting = mongoose.model("Setting", SettingSchema);
module.exports = Setting;

