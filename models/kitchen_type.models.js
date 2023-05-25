const mongoose = require("mongoose");

const kitchenTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const KitchenType = mongoose.model("kitchen_type", kitchenTypeSchema);

module.exports = KitchenType;
