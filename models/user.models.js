const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  type: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  workingAt: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  fcm_token: { type: String, required: false },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
