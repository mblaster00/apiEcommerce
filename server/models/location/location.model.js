const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var LocationSchema = new Schema({
    locationAdress: String,
    locationCountry: String,
    locationCountryflag: String,
    locationState: String,
    locationCity: String,
    locationPhoneNumber: String,
    contactName: String,
    BP: String,
    alpha2Code: String,
    alpha3Code: String,
    createdAt: Date,
    updatedAt: Date,
});

const Location = mongoose.model("Location", LocationSchema);
module.exports = Location;