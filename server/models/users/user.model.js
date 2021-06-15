// server/models/user.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    index: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    index: true,
    required: true
  },
  phone: {
    type: String,
    index: true,
  },
  companyName: {
    type: String,
    required: true,
    index: true
  },
  country: {
    type: String,
    required: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  accessToken: {
    type: String,
  },
  active: {
    type: Boolean,
    default: false,
  },
  created_at: Date,
  updated_at: Date,
  lastLogin: Date
});

const User = mongoose.model("User", UserSchema);

module.exports = User;