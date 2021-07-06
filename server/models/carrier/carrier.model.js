const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var CarrierSchema = new Schema({
    name: String,
    code: String,
    phone: String,
    homepage: String,
    type: String,
    picture: String,
    name_cn: String
});

const Carrier = mongoose.model("Carrier", CarrierSchema);
module.exports = Carrier;