// server/models/item.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  label: {
    type: String,
    index: true,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  size: []
});

const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;