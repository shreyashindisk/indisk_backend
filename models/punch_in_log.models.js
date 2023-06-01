const mongoose = require("mongoose");

const PunchInLogSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  punch_in_time: {
    type: Date,
    required: true,
  },
  punch_out_time: {
    type: Date,
    required: false,
    default: null,
  },
});

module.exports = mongoose.model("PunchInLog", PunchInLogSchema);
