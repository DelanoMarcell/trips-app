const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "User"],
    required: true,
  },
  verified: {
    type: Boolean,
    default: false, // Default value is false
  },
  resetCode: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
