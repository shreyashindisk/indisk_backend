const mongoose = require("mongoose");

const StaffShift = mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  shift: {
    type: Array,
    required: true,
  },
  shiftChangedDetails: {
    type: Array,
    required: false,
  },
  kitchen: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("StaffShift", StaffShift);
