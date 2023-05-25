const mongoose = require("mongoose");

const reservedDayPlansSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  isHoliday: {
    type: Boolean,
    default: false,
  },
  tasks: {
    type: Array,
    required: true,
  },
});

const ReservedDayPlans = mongoose.model(
  "reserved_day_plans",
  reservedDayPlansSchema
);

module.exports = ReservedDayPlans;
