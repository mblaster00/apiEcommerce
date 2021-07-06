const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var StatuSchema = new Schema({
  statusCode: String,
  statusTitle: String,
  createdAt: Date,
  updatedAt: Date
});

const Statu = mongoose.model("Statu", StatuSchema);
module.exports = Statu;