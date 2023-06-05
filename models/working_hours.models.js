const mongoose = require("mongoose");

const WorkingHoursSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  date: {
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
  workingAt: {
    type: String,
    required: true,
  },
  workingAtOriginal: {
    type: String,
    required: true,
  },
  workingHoursInMins: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("WorkingHours", WorkingHoursSchema);
