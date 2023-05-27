const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  document_url: { type: String, required: false, default: "" },
  video_url: { type: String, required: false, default: "" },
  kitchen: { type: String, required: true },
  comments: { type: String, required: false, default: "" },
});

const Training = mongoose.model("training", trainingSchema);

module.exports = Training;
