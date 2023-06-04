const mongoose = require("mongoose");

const openShiftSchema = new mongoose.Schema({
  kitchen: { type: String, required: true },
  month: { type: String, required: true },
  year: { type: String, required: true },
  day: { type: String, required: true },
  earlierUsernameForShift: { type: String, required: true },
  laterUsernameForShift: { type: String, required: false, default: null },
  timeSlot: { type: String, required: true },
});

const OpenShift = mongoose.model("open_shift", openShiftSchema);

module.exports = OpenShift;
